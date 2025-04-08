-- SQL Server Database Schema for Movie Recommendation Application

-- Create Movie Table
CREATE TABLE Movies (
    MovieId INT PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    ReleaseYear INT,
    Genre NVARCHAR(100),
    Director NVARCHAR(255),
    StarRating FLOAT,
    Duration INT,
    Rating NVARCHAR(10),
    Plot NVARCHAR(MAX),
    MoviePoster NVARCHAR(MAX)
);

-- Create User Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255),
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    Age INT,
    Gender NVARCHAR(20),
    City NVARCHAR(100),
    State NVARCHAR(50),
    Zip NVARCHAR(20),
    Netflix INT DEFAULT 0,
    AmazonPrime INT DEFAULT 0,
    DisneyPlus INT DEFAULT 0,
    ParamountPlus INT DEFAULT 0,
    Max INT DEFAULT 0,
    Hulu INT DEFAULT 0,
    AppleTVPlus INT DEFAULT 0,
    Peacock INT DEFAULT 0,
    PasswordHash NVARCHAR(MAX),
    Role NVARCHAR(50) DEFAULT 'User'
);

-- Create unique index on Email
CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);

-- Create Rating Table (with composite primary key)
CREATE TABLE Ratings (
    UserId INT NOT NULL,
    MovieId INT NOT NULL,
    RatingValue INT NOT NULL,
    RatingDate DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (UserId, MovieId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (MovieId) REFERENCES Movies(MovieId) ON DELETE CASCADE
);

-- Create __EFMigrationsHistory table (required for EF Core)
CREATE TABLE __EFMigrationsHistory (
    MigrationId NVARCHAR(150) NOT NULL,
    ProductVersion NVARCHAR(32) NOT NULL,
    PRIMARY KEY (MigrationId)
);
