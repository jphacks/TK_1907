package router

import (
	"github.com/jphacks/TK_1907/golang-api-server/internal/pkg/handler"
	"github.com/labstack/echo"
)

// Init ...
func Init() *echo.Echo {

	e := echo.New()

	e.GET("/health", handler.HealthCheck())

	return e
}
