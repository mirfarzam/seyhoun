package main

import (
	"log"
	"os"
	"seyhoun/internal/db"
	"seyhoun/internal/server"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "1995"
	}

	database, err := db.Open("seyhoun.db")
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer database.Close()

	srv := server.New(database)
	addr := ":" + port
	log.Printf("Seyhoun running on http://localhost%s", addr)
	if err := srv.Start(addr); err != nil {
		log.Fatal(err)
	}
}
