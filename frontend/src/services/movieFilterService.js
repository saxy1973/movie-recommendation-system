// =========================
// MOVIE FILTER SERVICE
// =========================

const normalizeText = (value) => {
  if (Array.isArray(value)) {
    return value
      .join(",")
      .toLowerCase()
      .trim();
  }

  return String(value || "")
    .toLowerCase()
    .trim();
};


// =========================
// GET MOVIE YEAR
// =========================

const getMovieYear = (movie) => {
  const value =
    movie?.Year ||
    movie?.year ||
    movie?.releaseYear ||
    movie?.releaseDate ||
    "";

  const match = String(value).match(/\d{4}/);

  return match ? Number(match[0]) : null;
};


// =========================
// FILTER MOVIES
// =========================

export const filterMovies = (movies = [], filters = {}) => {
  const {
    startYear = "",
    endYear = "",
    languages = [],
    industries = [],
    genres = [],
    contentType = "Both",
  } = filters;

  return movies.filter((movie) => {

    // -------------------------
    // YEAR RANGE
    // -------------------------

    const movieYear = getMovieYear(movie);

    if (
      startYear &&
      movieYear !== null &&
      movieYear < Number(startYear)
    ) {
      return false;
    }

    if (
      endYear &&
      movieYear !== null &&
      movieYear > Number(endYear)
    ) {
      return false;
    }


    // -------------------------
    // LANGUAGE
    // -------------------------

    if (languages.length > 0) {
      const movieLanguage = normalizeText(
        movie?.Language ||
        movie?.language ||
        movie?.languages
      );

      const matchesLanguage = languages.some(
        (language) =>
          movieLanguage.includes(
            normalizeText(language)
          )
      );

      if (!matchesLanguage) {
        return false;
      }
    }


    // -------------------------
    // INDUSTRY
    // -------------------------

    if (industries.length > 0) {
      const movieIndustry = normalizeText(
        movie?.Industry ||
        movie?.industry ||
        movie?.industries
      );

      const matchesIndustry = industries.some(
        (industry) =>
          movieIndustry.includes(
            normalizeText(industry)
          )
      );

      if (!matchesIndustry) {
        return false;
      }
    }


    // -------------------------
    // GENRE
    // -------------------------

    if (genres.length > 0) {
      const movieGenre = normalizeText(
        movie?.Genre ||
        movie?.genre ||
        movie?.genres
      );

      const matchesGenre = genres.some(
        (genre) =>
          movieGenre.includes(
            normalizeText(genre)
          )
      );

      if (!matchesGenre) {
        return false;
      }
    }


    // -------------------------
    // CONTENT TYPE
    // -------------------------

    if (contentType !== "Both") {
      const movieType = normalizeText(
        movie?.Type ||
        movie?.type ||
        movie?.contentType
      );

      if (
        contentType === "Movies" &&
        !["movie", "movies"].includes(movieType)
      ) {
        return false;
      }

      if (
        contentType === "Series" &&
        !["series", "series"].includes(movieType)
      ) {
        return false;
      }
    }


    // -------------------------
    // ALL FILTERS PASSED
    // -------------------------

    return true;
  });
};


// =========================
// DEFAULT FILTERS
// =========================

export const getDefaultFilters = () => ({
  startYear: "",
  endYear: "",
  languages: [],
  industries: [],
  genres: [],
  contentType: "Both",
});