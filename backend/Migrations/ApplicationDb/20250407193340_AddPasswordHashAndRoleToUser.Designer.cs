﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MovieRecommendationAPI.Data;

#nullable disable

namespace MovieRecommendationAPI.Migrations.ApplicationDb
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250407193340_AddPasswordHashAndRoleToUser")]
    partial class AddPasswordHashAndRoleToUser
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.3");

            modelBuilder.Entity("MovieRecommendationAPI.Models.Movie", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT")
                        .HasColumnName("show_id");

                    b.Property<int?>("Action")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Action");

                    b.Property<int?>("Adventure")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Adventure");

                    b.Property<int?>("AnimeSeriesInternationalTVShows")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Anime Series International TV Shows");

                    b.Property<int?>("BritishTVShowsDocuseriesInternationalTVShows")
                        .HasColumnType("INTEGER")
                        .HasColumnName("British TV Shows Docuseries International TV Shows");

                    b.Property<string>("Cast")
                        .HasColumnType("TEXT")
                        .HasColumnName("cast");

                    b.Property<int?>("Children")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Children");

                    b.Property<int?>("Comedies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Comedies");

                    b.Property<int?>("ComediesDramasInternationalMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Comedies Dramas International Movies");

                    b.Property<int?>("ComediesInternationalMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Comedies International Movies");

                    b.Property<int?>("ComediesRomanticMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Comedies Romantic Movies");

                    b.Property<string>("Country")
                        .HasColumnType("TEXT")
                        .HasColumnName("country");

                    b.Property<int?>("CrimeTVShowsDocuseries")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Crime TV Shows Docuseries");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT")
                        .HasColumnName("description");

                    b.Property<string>("Director")
                        .HasColumnType("TEXT")
                        .HasColumnName("director");

                    b.Property<int?>("Documentaries")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Documentaries");

                    b.Property<int?>("DocumentariesInternationalMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Documentaries International Movies");

                    b.Property<int?>("Docuseries")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Docuseries");

                    b.Property<int?>("Dramas")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Dramas");

                    b.Property<int?>("DramasInternationalMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Dramas International Movies");

                    b.Property<int?>("DramasRomanticMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Dramas Romantic Movies");

                    b.Property<string>("Duration")
                        .HasColumnType("TEXT")
                        .HasColumnName("duration");

                    b.Property<int?>("FamilyMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Family Movies");

                    b.Property<int?>("Fantasy")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Fantasy");

                    b.Property<int?>("HorrorMovies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Horror Movies");

                    b.Property<int?>("InternationalMoviesThrillers")
                        .HasColumnType("INTEGER")
                        .HasColumnName("International Movies Thrillers");

                    b.Property<int?>("InternationalTVShowsRomanticTVShowsTVDramas")
                        .HasColumnType("INTEGER")
                        .HasColumnName("International TV Shows Romantic TV Shows TV Dramas");

                    b.Property<int?>("KidsTV")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Kids' TV");

                    b.Property<int?>("LanguageTVShows")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Language TV Shows");

                    b.Property<int?>("Musicals")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Musicals");

                    b.Property<int?>("NatureTV")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Nature TV");

                    b.Property<string>("Rating")
                        .HasColumnType("TEXT")
                        .HasColumnName("rating");

                    b.Property<int?>("RealityTV")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Reality TV");

                    b.Property<int?>("ReleaseYear")
                        .HasColumnType("INTEGER")
                        .HasColumnName("release_year");

                    b.Property<int?>("Spirituality")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Spirituality");

                    b.Property<int?>("TVAction")
                        .HasColumnType("INTEGER")
                        .HasColumnName("TV Action");

                    b.Property<int?>("TVComedies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("TV Comedies");

                    b.Property<int?>("TVDramas")
                        .HasColumnType("INTEGER")
                        .HasColumnName("TV Dramas");

                    b.Property<int?>("TalkShowsTVComedies")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Talk Shows TV Comedies");

                    b.Property<int?>("Thrillers")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Thrillers");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT")
                        .HasColumnName("title");

                    b.Property<string>("Type")
                        .HasColumnType("TEXT")
                        .HasColumnName("type");

                    b.HasKey("Id");

                    b.ToTable("movies_titles");
                });

            modelBuilder.Entity("MovieRecommendationAPI.Models.Rating", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER")
                        .HasColumnName("user_id");

                    b.Property<string>("MovieId")
                        .HasColumnType("TEXT")
                        .HasColumnName("show_id");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("TEXT")
                        .HasColumnName("timestamp");

                    b.Property<int>("Value")
                        .HasColumnType("INTEGER")
                        .HasColumnName("rating");

                    b.HasKey("UserId", "MovieId");

                    b.HasIndex("MovieId");

                    b.ToTable("movies_ratings");
                });

            modelBuilder.Entity("MovieRecommendationAPI.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER")
                        .HasColumnName("user_id");

                    b.Property<int?>("Age")
                        .HasColumnType("INTEGER")
                        .HasColumnName("age");

                    b.Property<int?>("AmazonPrime")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Amazon Prime");

                    b.Property<int?>("AppleTVPlus")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Apple TV+");

                    b.Property<string>("City")
                        .HasColumnType("TEXT")
                        .HasColumnName("city");

                    b.Property<int?>("DisneyPlus")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Disney+");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT")
                        .HasColumnName("email");

                    b.Property<string>("Gender")
                        .HasColumnType("TEXT")
                        .HasColumnName("gender");

                    b.Property<int?>("Hulu")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Hulu");

                    b.Property<int?>("Max")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Max");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT")
                        .HasColumnName("name");

                    b.Property<int?>("Netflix")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Netflix");

                    b.Property<int?>("ParamountPlus")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Paramount+");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT")
                        .HasColumnName("password_hash");

                    b.Property<int?>("Peacock")
                        .HasColumnType("INTEGER")
                        .HasColumnName("Peacock");

                    b.Property<string>("Phone")
                        .HasColumnType("TEXT")
                        .HasColumnName("phone");

                    b.Property<string>("Role")
                        .HasColumnType("TEXT")
                        .HasColumnName("role");

                    b.Property<string>("State")
                        .HasColumnType("TEXT")
                        .HasColumnName("state");

                    b.Property<int?>("Zip")
                        .HasColumnType("INTEGER")
                        .HasColumnName("zip");

                    b.HasKey("Id");

                    b.ToTable("movies_users");
                });

            modelBuilder.Entity("MovieRecommendationAPI.Models.Rating", b =>
                {
                    b.HasOne("MovieRecommendationAPI.Models.Movie", "Movie")
                        .WithMany("Ratings")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieRecommendationAPI.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");

                    b.Navigation("User");
                });

            modelBuilder.Entity("MovieRecommendationAPI.Models.Movie", b =>
                {
                    b.Navigation("Ratings");
                });

            modelBuilder.Entity("MovieRecommendationAPI.Models.User", b =>
                {
                    b.Navigation("Ratings");
                });
#pragma warning restore 612, 618
        }
    }
}
