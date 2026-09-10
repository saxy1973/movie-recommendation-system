import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyPreferences.css";

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Thriller",
  "Sci-Fi",
  "Fantasy",
  "Animation",
];

const languages = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Korean",
  "Japanese",
  "Spanish",
];

const industries = [
  "Bollywood",
  "Tollywood",
  "Kollywood",
  "Mollywood",
  "Sandalwood",
  "Hollywood",
];

const defaultPreferences = {
  genres: [],
  language: ["English"],
  industries: [],
  minRating: 7,
  contentType: "Both",
};

const MyPreferences = () => {
  const [preferences, setPreferences] = useState(
    defaultPreferences
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // =========================================
  // CURRENT USER
  // =========================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // =========================================
  // LOAD PREFERENCES
  // =========================================

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/preferences/${user.id}`
        );

        console.log(
          "Loaded preferences:",
          response.data
        );

        if (response.data.success) {
          const data = response.data.preferences || {};

          setPreferences({
            genres: Array.isArray(data.genres)
              ? data.genres
              : [],

            language: Array.isArray(data.language)
              ? data.language
              : data.language
              ? [data.language]
              : ["English"],

            industries: Array.isArray(data.industries)
              ? data.industries
              : [],

            minRating:
              Number(data.minRating) || 7,

            contentType:
              data.contentType || "Both",
          });
        }
      } catch (error) {
        console.error(
          "Fetch Preferences Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.id]);

  // =========================================
  // GENRE
  // =========================================

  const handleGenreChange = (genre) => {
    setPreferences((prev) => {
      const selected = prev.genres.includes(genre);

      return {
        ...prev,
        genres: selected
          ? prev.genres.filter(
              (item) => item !== genre
            )
          : [...prev.genres, genre],
      };
    });

    setSaved(false);
  };

  // =========================================
  // LANGUAGE
  // =========================================

  const handleLanguageChange = (language) => {
    setPreferences((prev) => {
      const selected =
        prev.language.includes(language);

      return {
        ...prev,
        language: selected
          ? prev.language.filter(
              (item) => item !== language
            )
          : [...prev.language, language],
      };
    });

    setSaved(false);
  };

  // =========================================
  // INDUSTRY
  // =========================================

  const handleIndustryChange = (industry) => {
    setPreferences((prev) => {
      const selected =
        prev.industries.includes(industry);

      return {
        ...prev,
        industries: selected
          ? prev.industries.filter(
              (item) => item !== industry
            )
          : [...prev.industries, industry],
      };
    });

    setSaved(false);
  };

  // =========================================
  // RATING
  // =========================================

  const handleRatingChange = (e) => {
    setPreferences((prev) => ({
      ...prev,
      minRating: Number(e.target.value),
    }));

    setSaved(false);
  };

  // =========================================
  // CONTENT TYPE
  // =========================================

  const handleContentTypeChange = (type) => {
    setPreferences((prev) => ({
      ...prev,
      contentType: type,
    }));

    setSaved(false);
  };

  // =========================================
  // SAVE
  // =========================================

  const handleSave = async () => {
    if (!user?.id) {
      alert("Please login again");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const dataToSave = {
        genres: preferences.genres,
        language: preferences.language,
        industries: preferences.industries,
        minRating: preferences.minRating,
        contentType: preferences.contentType,
      };

      console.log(
        "Sending preferences:",
        dataToSave
      );

      const response = await api.put(
        `/preferences/${user.id}`,
        dataToSave
      );

      console.log(
        "Save response:",
        response.data
      );

      if (response.data.success) {
        const data =
          response.data.preferences || {};

        setPreferences({
          genres: Array.isArray(data.genres)
            ? data.genres
            : [],

          language: Array.isArray(data.language)
            ? data.language
            : data.language
            ? [data.language]
            : ["English"],

          industries: Array.isArray(data.industries)
            ? data.industries
            : [],

          minRating:
            Number(data.minRating) || 7,

          contentType:
            data.contentType || "Both",
        });

        setSaved(true);
      }
    } catch (error) {
      console.error(
        "Save Preferences Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to save preferences"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="preferences-page">
        <div className="preferences-container">
          <div className="preferences-card">
            <h2>
              Loading preferences...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="preferences-page">
      <div className="preferences-container">

        <h1>My Preferences</h1>

        <p className="preferences-subtitle">
          Customize your movie experience on Movira
        </p>

        <div className="preferences-card">

          {/* ===============================
              GENRES
          =============================== */}

          <div className="preference-section">

            <h2>Favorite Genres</h2>

            <p className="section-description">
              Select the genres you enjoy watching.
            </p>

            <div className="genre-list">

              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={
                    preferences.genres.includes(genre)
                      ? "genre-btn selected"
                      : "genre-btn"
                  }
                  onClick={() =>
                    handleGenreChange(genre)
                  }
                >
                  {genre}
                </button>
              ))}

            </div>

          </div>


          {/* ===============================
              LANGUAGES
          =============================== */}

          <div className="preference-section">

            <h2>Preferred Languages</h2>

            <p className="section-description">
              Select one or more languages.
            </p>

            <div className="genre-list">

              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  className={
                    preferences.language.includes(
                      language
                    )
                      ? "genre-btn selected"
                      : "genre-btn"
                  }
                  onClick={() =>
                    handleLanguageChange(language)
                  }
                >
                  {language}
                </button>
              ))}

            </div>

            <p className="selected-text">
              Selected:{" "}
              {preferences.language.length
                ? preferences.language.join(", ")
                : "None"}
            </p>

          </div>


          {/* ===============================
              INDUSTRIES
          =============================== */}

          <div className="preference-section">

            <h2>Preferred Industries</h2>

            <p className="section-description">
              Select one or more film industries.
            </p>

            <div className="genre-list">

              {industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  className={
                    preferences.industries.includes(
                      industry
                    )
                      ? "genre-btn selected"
                      : "genre-btn"
                  }
                  onClick={() =>
                    handleIndustryChange(industry)
                  }
                >
                  {industry}
                </button>
              ))}

            </div>

            <p className="selected-text">
              Selected:{" "}
              {preferences.industries.length
                ? preferences.industries.join(", ")
                : "None"}
            </p>

          </div>


          {/* ===============================
              RATING
          =============================== */}

          <div className="preference-section">

            <h2>Minimum Rating</h2>

            <p className="section-description">
              Show movies with at least this rating.
            </p>

            <div className="rating-value">
              ⭐ {preferences.minRating}/10
            </div>

            <input
              className="rating-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={preferences.minRating}
              onChange={handleRatingChange}
            />

            <div className="rating-range">
              <span>1</span>
              <span>10</span>
            </div>

          </div>


          {/* ===============================
              CONTENT TYPE
          =============================== */}

          <div className="preference-section">

            <h2>Content Type</h2>

            <p className="section-description">
              Choose what you want to discover.
            </p>

            <div className="content-type-list">

              {["Movies", "Series", "Both"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className={
                      preferences.contentType === type
                        ? "content-type-btn selected"
                        : "content-type-btn"
                    }
                    onClick={() =>
                      handleContentTypeChange(type)
                    }
                  >
                    {type}
                  </button>
                )
              )}

            </div>

          </div>


          {/* ===============================
              SAVE
          =============================== */}

          <button
            className="save-preferences-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Preferences"}
          </button>

          {saved && (
            <p className="preferences-saved">
              ✓ Preferences saved successfully
            </p>
          )}

        </div>

      </div>
    </div>
  );
};

export default MyPreferences;