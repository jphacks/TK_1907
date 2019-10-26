package main

import (
	"context"
	"flag"
	"os"
	"os/signal"
	"runtime"
	"time"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/logger"
	"go.uber.org/zap"

	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/config"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/database"
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
		CPU  int
		DB   database.Config
		Node node.Config
	}{}
	config.MustNew(*confFilePath, &cfg)

	runtime.GOMAXPROCS(cfg.CPU)

	e := router.Init()

	go func() {
		if err := e.Start(":8080"); err != nil {
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
