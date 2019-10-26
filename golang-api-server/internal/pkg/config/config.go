package config

import (
	"github.com/fsnotify/fsnotify"
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/logger"
	"github.com/spf13/viper"
)

// MustNew ...
func MustNew(filePath string, rawVal interface{}) {
	viper.SetConfigFile(filePath)
	viper.SetConfigType("toml")
	viper.AutomaticEnv()

	if err := Read(rawVal); err != nil {
		logger.Fatal(err.Error())
	}
}

// Read ...
func Read(rawVal interface{}) error {
	if err := viper.ReadInConfig(); err != nil {
		return err
	}

	if err := viper.Unmarshal(rawVal); err != nil {
		return err
	}

	return nil
}

// OnChange ...
func OnChange(run func(in fsnotify.Event)) {
	viper.WatchConfig()
	viper.OnConfigChange(run)
}
