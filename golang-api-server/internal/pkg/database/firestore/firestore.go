package firestore

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pkg/errors"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"
)

const (
	batchLimit = 500
)

var (
	increment = firestore.Increment(1)
)

// New ...
func New(cfg database.Config) (database.Database, error) {
	keepaliveOption := option.WithGRPCDialOption(grpc.WithKeepaliveParams(keepalive.ClientParameters{
		Time:                cfg.Keepalive * time.Second,
		PermitWithoutStream: true,
	}))

	client, err := firestore.NewClient(context.Background(), cfg.ProjectID, keepaliveOption)
	if err != nil {
		return nil, err
	}

	return &Firestore{client: client, config: cfg}, nil
}

// Firestore ...
type Firestore struct {
	client *firestore.Client
	config database.Config
}

// GetTitle ...
func (f *Firestore) GetTitle(contractAddr string) (string, error) {
	bookRef := f.client.Doc(fmt.Sprintf("Books/%s", contractAddr))
	docSnap, err := bookRef.Get(context.Background())
	if err != nil {
		if status.Code(err) != codes.NotFound {
			return "", err
		}
	}
	var book database.Book
	if err := docSnap.DataTo(&book); err != nil {
		return "", err
	}

	return book.Title, nil
}

// IncreasePV ...
func (f *Firestore) IncreasePV(contractAddr string) error {
	bookRef := f.client.Doc(fmt.Sprintf("Books/%s", contractAddr))
	if _, err := bookRef.Update(context.Background(), []firestore.Update{
		{Path: "PV", Value: firestore.Increment(1)},
	}); err != nil {
		return err
	}
	return nil
}

// SetPages ...
func (f *Firestore) SetPages(contractAddr, title, chapter, summary string, pages []database.PageInfo) error {
	sort.Slice(pages, func(i, j int) bool {
		return pages[i].Page < pages[j].Page
	})
	bookRef := f.client.Doc(fmt.Sprintf("Books/%s", contractAddr))
	_, err := bookRef.Get(context.Background())
	if err != nil {
		if status.Code(err) != codes.NotFound {
			return err
		}
		if _, err := bookRef.Set(context.Background(), struct {
			PV               int64
			WrappedThumbnail string
			Thumbnail        string
			Title            string
			Summary          string
		}{
			PV:               0,
			WrappedThumbnail: fmt.Sprintf("https://api-server-o57wjya6va-an.a.run.app/getImage/%s/%s/%d", contractAddr, chapter, 0),
			Thumbnail:        pages[0].StorageURL,
			Title:            title,
			Summary:          summary,
		}); err != nil {
			return errors.WithStack(err)
		}
	}

	chapterNum, err := strconv.ParseInt(chapter, 10, 64)
	if err != nil {
		return err
	}

	chapterRef := f.client.Doc(fmt.Sprintf("Books/%s/Chapters/%d", contractAddr, chapterNum))
	_, err = chapterRef.Get(context.Background())
	if err != nil {
		if status.Code(err) != codes.NotFound {
			return err
		}
		if _, err := chapterRef.Set(context.Background(), struct {
			ChapterNumber    int64
			WrappedThumbnail string
			Thumbnail        string
			Title            string
		}{
			ChapterNumber:    chapterNum,
			WrappedThumbnail: fmt.Sprintf("https://api-server-o57wjya6va-an.a.run.app/getImage/%s/%s/%d", contractAddr, chapter, 0),
			Thumbnail:        pages[0].StorageURL,
			Title:            fmt.Sprintf("%d巻 %s", chapterNum, title),
		}); err != nil {
			return errors.WithStack(err)
		}
	}

	for _, chunk := range chunk(pages, batchLimit) {
		batch := f.client.Batch()
		for _, page := range chunk {
			txRef := f.client.Doc(fmt.Sprintf("Books/%s/Chapters/%s/Pages/%d", contractAddr, chapter, page.(database.PageInfo).Page))
			batch.Set(txRef, struct {
				PageNumber int64
				URL        string
				WrappedURL string
			}{
				PageNumber: page.(database.PageInfo).Page,
				URL:        page.(database.PageInfo).StorageURL,
				WrappedURL: fmt.Sprintf("https://api-server-o57wjya6va-an.a.run.app/getImage/%s/%d/%d", contractAddr, chapterNum, page.(database.PageInfo).Page),
			})
		}

		if _, err := batch.Commit(context.Background()); err != nil {
			if err.Error() == "firestore: cannot commit empty WriteBatch" {
				return nil
			}
			return errors.WithStack(err)
		}
	}

	return nil
}

func chunk(array interface{}, size int) [][]interface{} {
	var beforeChunk []interface{}
	switch array.(type) {
	case []database.PageInfo:
		txs := array.([]database.PageInfo)
		for _, tx := range txs {
			beforeChunk = append(beforeChunk, tx)
		}
	}

	var chunk []interface{}
	chunks := make([][]interface{}, 0, len(beforeChunk)/size+1)
	for len(beforeChunk) >= size {
		chunk, beforeChunk = beforeChunk[:size], beforeChunk[size:]
		chunks = append(chunks, chunk)
	}

	length := len(beforeChunk)
	if length > 0 {
		chunks = append(chunks, beforeChunk[:length])
	}

	return chunks
}
