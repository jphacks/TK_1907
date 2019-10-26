package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"runtime"
	"time"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage/cloudstorage"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database/firestore"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/storage"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/logger"
	"go.uber.org/zap"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/config"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/ethereum"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/node"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/router"
)

const (
	defaultConfFilePath = "./configs/config.toml"
)

func main() {
	var confFilePath = flag.String("f", defaultConfFilePath, "path to configuration file")
	flag.Parse()

	var cfg = struct {
		CPU      int
		DB       database.Config
		Node     node.Config
		Storage  storage.Config
		Ethereum ethereum.Config
	}{}
	config.MustNew(*confFilePath, &cfg)
	logger.Info("Config was loaded.", zap.Any("config", cfg))

	runtime.GOMAXPROCS(cfg.CPU)

	db, err := firestore.New(cfg.DB)
	if err != nil {
		logger.Panic("Error", zap.Error(err))
	}
	s, err := cloudstorage.New(cfg.Storage)
	if err != nil {
		logger.Panic("Error", zap.Error(err))
	}
	eth, err := ethereum.New(cfg.Ethereum.Endpoint)
	defer eth.Close()
	if err != nil {
		logger.Panic("Error", zap.Error(err))
	}
	e := router.Init(db, s, eth)

	go func() {
		if err := e.Start(fmt.Sprintf(":%s", os.Getenv("PORT"))); err != nil {
			logger.Panic("Error", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
