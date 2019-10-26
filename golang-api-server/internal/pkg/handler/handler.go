package handler

import (
	"net/http"

	"github.com/labstack/echo"
)

// HealthCheck ...
func HealthCheck() echo.HandlerFunc {
	return func(c echo.Context) error {
		return c.JSON(http.StatusOK, "")
	}
}
