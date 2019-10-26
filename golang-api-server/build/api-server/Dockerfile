FROM golang:1.12 as build
LABEL Maintainer="Hiroki Nanjo <CoralGift.N.H@uec.ac.jp>"
ENV GO111MODULE on

COPY . /go/src/tmp
WORKDIR /go/src/tmp
RUN make go-build-amd64

FROM alpine:latest
RUN apk --no-cache add ca-certificates \
    && apk add --no-cache libc6-compat
COPY --from=build /go/src/tmp/exe .
RUN ls -al
ENTRYPOINT ["./exe"]
