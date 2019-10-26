package handler

import (
	"archive/zip"
	"context"
	"net/http"
	"path/filepath"
	"regexp"
	"strconv"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"

	"golang.org/x/xerrors"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage"

	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/ethereum"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/logger"
	"go.uber.org/zap"

	"github.com/labstack/echo"
)

// HealthCheck ...
func HealthCheck() echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, "")
	}
}

// UploadImage ...
func UploadImage(db database.Database, s storage.Storage, eth ethereum.Ethereum) echo.HandlerFunc {
	return func(c echo.Context) error {
		title := c.FormValue("title")
		chapter := c.FormValue("chapter")
		signedTx := c.FormValue("signedTx")
		sender := c.FormValue("sender")
		nonce := c.FormValue("nonce")
		if title == "" ||
			chapter == "" ||
			signedTx == "" ||
			sender == "" ||
			nonce == "" {
			err := xerrors.New("invalid argument")
			logger.Error("Invalid Argument", zap.Error(err), zap.String("Title", title), zap.String("Chapter", chapter), zap.String("SignedTx", signedTx), zap.String("Sender", sender), zap.String("Nonce", nonce))
			return err
		}

		salt, _ := strconv.ParseUint(nonce, 10, 64)
		contractAddr, err := ethereum.GetDeploymentAddress(eth, salt, sender)
		if err != nil {
			logger.Error("GetDeploymentAddress failed", zap.Error(err))
			return err
		}

		file, err := c.FormFile("file")
		if err != nil {
			logger.Error("FormFile load failed", zap.Error(err))
			return err
		}
		src, err := file.Open()
		if err != nil {
			logger.Error("FormFile open failed", zap.Error(err))
			return err
		}
		defer src.Close()

		r, err := zip.NewReader(src, file.Size)
		if err != nil {
			logger.Error("ZipFile load failed", zap.Error(err))
			return err
		}

		l := len(r.File)
		var workers = 32
		if l < workers {
			workers = l
		}

		inChan := make(chan *zip.File, l)
		go func(in chan<- *zip.File, files []*zip.File) {
			defer close(in)
			for _, file := range files {
				fileName := filepath.Base(file.Name)
				if ma, _ := regexp.MatchString(`^\.\S*$`, fileName); !ma {
					switch filepath.Ext(fileName) {
					case ".jpg", ".jpeg":
						in <- file
					}
				}
			}
		}(inChan, r.File)

		outChan := make(chan database.PageInfo, l)
		eg, egctx := errgroup.WithContext(context.Background())
		for w := 0; w < workers; w++ {
			eg.Go(func() error {
				for in := range inChan {
					select {
					case <-egctx.Done():
						return nil
					default:
						storageURL, page, err := s.UploadImage(in, title, chapter, contractAddr)
						if err != nil {
							return err
						}
						outChan <- database.PageInfo{
							Page:       page,
							StorageURL: storageURL,
						}
					}
				}
				return nil
			})
		}

		if err := eg.Wait(); err != nil {
			logger.Error("error occuered in errorgroup", zap.Error(err))
			return errors.WithStack(err)
		}

		close(outChan)

		var pages = make([]database.PageInfo, 0, l)
		for out := range outChan {
			pages = append(pages, out)
		}

		if err := db.SetPages(contractAddr, title, chapter, pages); err != nil {
			logger.Error("error occuered in SetPages", zap.Error(err))
			return err
		}
		return c.JSON(http.StatusOK, "")
	}
}

// GetImage ...
func GetImage(db database.Database, s storage.Storage) echo.HandlerFunc {
	return func(c echo.Context) error {
		bookID := c.Param("addr")
		chapter := c.Param("chapter")
		page := c.Param("page")
		if bookID == "" ||
			chapter == "" ||
			page == "" {
			err := xerrors.New("invalid argument")
			logger.Error("Invalid Argument", zap.Error(err), zap.String("addr", bookID), zap.String("chapter", chapter), zap.String("page", page))
			return err
		}

		chapterNum, err := strconv.ParseInt(chapter, 10, 64)
		if err != nil {
			return err
		}
		pageNum, err := strconv.ParseInt(page, 10, 64)
		if err != nil {
			return err
		}

		title, err := db.GetTitle(bookID)
		if err != nil {
			logger.Error("error occuered in GetTitle", zap.Error(err))
			return err
		}

		var imageBytes []byte
		switch pageNum {
		case 0:
			imageBytes, err = s.GetImage(title, chapterNum, 1)
			if err != nil {
				logger.Error("error occuered in GetImage", zap.Error(err))
				return err
			}
		case 1:
			imageBytes, err = s.GetImage(title, chapterNum, pageNum)
			if err != nil {
				logger.Error("error occuered in GetImage", zap.Error(err))
				return err
			}
			if err := db.IncreasePV(bookID); err != nil {
				logger.Error("error occuered in IncreasePV", zap.Error(err))
				return err
			}
		default:
			imageBytes, err = s.GetImage(title, chapterNum, pageNum)
			if err != nil {
				logger.Error("error occuered in GetImage", zap.Error(err))
				return err
			}
		}

		return c.Blob(http.StatusOK, "image/jpeg", imageBytes)
	}
}
