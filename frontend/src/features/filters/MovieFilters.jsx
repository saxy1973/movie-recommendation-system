import { useState } from "react";
import "./movieFilters.css";

const currentYear = new Date().getFullYear();

const LANGUAGES = [
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

const INDUSTRIES = [
  "Bollywood",
  "Tollywood",
  "Kollywood",
  "Mollywood",
  "Sandalwood",
  "Hollywood",
];

const GENRES = [
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

const CONTENT_TYPES = [
  "Movies",
  "Series",
  "Both",
];

const MovieFilters = ({
  onApply,
  onClear,
  initialFilters,
  showYear = true,
}) => {
  const [filters, setFilters] = useState(
    initialFilters || {
      startYear: "",
      endYear: "",
      languages: [],
      industries: [],
      genres: [],
      contentType: "Both",
    }
  );

  const [openDropdown, setOpenDropdown] = useState(null);

  /* =========================
     TOGGLE DROPDOWN
  ========================= */

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) =>
      prev === key ? null : key
    );
  };

  /* =========================
     MULTI SELECT
  ========================= */

  const toggleValue = (key, value) => {
    setFilters((prev) => {
      const currentValues = prev[key] || [];

      const exists = currentValues.includes(value);

      return {
        ...prev,
        [key]: exists
          ? currentValues.filter(
              (item) => item !== value
            )
          : [...currentValues, value],
      };
    });
  };

  /* =========================
     CONTENT TYPE
  ========================= */

  const selectContentType = (value) => {
    setFilters((prev) => ({
      ...prev,
      contentType: value,
    }));

    setOpenDropdown(null);
  };

  /* =========================
     SELECTED TEXT
  ========================= */

  const getSelectedText = (values) => {
    if (!values || values.length === 0) {
      return "All";
    }

    if (values.length === 1) {
      return values[0];
    }

    return `${values.length} selected`;
  };

  /* =========================
     YEAR DISPLAY
  ========================= */

  const getYearText = () => {
    const { startYear, endYear } = filters;

    if (startYear && endYear) {
      return `${startYear} - ${endYear}`;
    }

    if (startYear) {
      return `${startYear} -`;
    }

    if (endYear) {
      return `- ${endYear}`;
    }

    return "All";
  };

  /* =========================
     YEAR INPUT
  ========================= */

  const handleStartYear = (value) => {
    if (value === "") {
      setFilters((prev) => ({
        ...prev,
        startYear: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      startYear: value,
    }));
  };

  const handleEndYear = (value) => {
    if (value === "") {
      setFilters((prev) => ({
        ...prev,
        endYear: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      endYear: value,
    }));
  };

  /* =========================
     APPLY
  ========================= */

  const handleApply = () => {
    let finalFilters = {
      ...filters,
    };

    /*
      If start year is greater than end year,
      swap them automatically.
    */

    if (
      finalFilters.startYear &&
      finalFilters.endYear &&
      Number(finalFilters.startYear) >
        Number(finalFilters.endYear)
    ) {
      finalFilters = {
        ...finalFilters,
        startYear: finalFilters.endYear,
        endYear: finalFilters.startYear,
      };

      setFilters(finalFilters);
    }

    setOpenDropdown(null);

    onApply?.(finalFilters);
  };

  /* =========================
     CLEAR
  ========================= */

  const handleClear = () => {
    const clearedFilters = {
      startYear: "",
      endYear: "",
      languages: [],
      industries: [],
      genres: [],
      contentType: "Both",
    };

    setFilters(clearedFilters);

    setOpenDropdown(null);

    onClear?.(clearedFilters);
  };

  /* =========================
     MULTI SELECT DROPDOWN
  ========================= */

  const renderMultiSelect = (
    key,
    label,
    options
  ) => {
    const selectedValues =
      filters[key] || [];

    return (
      <div className="filter-item">
        <label className="filter-label">
          {label}
        </label>

        <button
          type="button"
          className="filter-select"
          onClick={() =>
            toggleDropdown(key)
          }
        >
          <span>
            {getSelectedText(
              selectedValues
            )}
          </span>

          <span
            className={`filter-arrow ${
              openDropdown === key
                ? "open"
                : ""
            }`}
          >
            ˅
          </span>
        </button>

        {openDropdown === key && (
          <div className="filter-dropdown">
            {options.map((option) => {
              const checked =
                selectedValues.includes(
                  option
                );

              return (
                <label
                  key={option}
                  className="filter-option"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      toggleValue(
                        key,
                        option
                      )
                    }
                  />

                  <span
                    className={`custom-check ${
                      checked
                        ? "checked"
                        : ""
                    }`}
                  >
                    {checked && "✓"}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="movie-filters">

      {/* =========================
          YEAR
      ========================= */}

      {showYear && (
        <div className="filter-item">
          <label className="filter-label">
            Year
          </label>

          <button
            type="button"
            className="filter-select"
            onClick={() =>
              toggleDropdown("year")
            }
          >
            <span>{getYearText()}</span>

            <span
              className={`filter-arrow ${
                openDropdown === "year"
                  ? "open"
                  : ""
              }`}
            >
              ˅
            </span>
          </button>

          {openDropdown === "year" && (
            <div className="year-dropdown">
              <div className="year-input-group">

                <div className="year-field">
                  <span>From</span>

                  <input
                    type="number"
                    min="1900"
                    max={currentYear}
                    placeholder="Start year"
                    value={filters.startYear}
                    onChange={(e) =>
                      handleStartYear(
                        e.target.value
                      )
                    }
                  />
                </div>

                <span className="year-arrow">
                  →
                </span>

                <div className="year-field">
                  <span>To</span>

                  <input
                    type="number"
                    min="1900"
                    max={currentYear}
                    placeholder="End year"
                    value={filters.endYear}
                    onChange={(e) =>
                      handleEndYear(
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              <p className="year-hint">
                Enter a range from 1900 to{" "}
                {currentYear}.
              </p>

              <button
                type="button"
                className="year-done"
                onClick={() =>
                  setOpenDropdown(null)
                }
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================
          LANGUAGE
      ========================= */}

      {renderMultiSelect(
        "languages",
        "Language",
        LANGUAGES
      )}

      {/* =========================
          INDUSTRY
      ========================= */}

      {renderMultiSelect(
        "industries",
        "Industry",
        INDUSTRIES
      )}

      {/* =========================
          GENRE
      ========================= */}

      {renderMultiSelect(
        "genres",
        "Genre",
        GENRES
      )}

      {/* =========================
          CONTENT TYPE
      ========================= */}

      <div className="filter-item">
        <label className="filter-label">
          Content Type
        </label>

        <button
          type="button"
          className="filter-select"
          onClick={() =>
            toggleDropdown(
              "contentType"
            )
          }
        >
          <span>
            {filters.contentType}
          </span>

          <span
            className={`filter-arrow ${
              openDropdown ===
              "contentType"
                ? "open"
                : ""
            }`}
          >
            ˅
          </span>
        </button>

        {openDropdown ===
          "contentType" && (
          <div className="filter-dropdown content-type-dropdown">

            {CONTENT_TYPES.map((type) => {
              const selected =
                filters.contentType ===
                type;

              return (
                <button
                  type="button"
                  key={type}
                  className={`content-type-option ${
                    selected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    selectContentType(type)
                  }
                >
                  <span>{type}</span>

                  {selected && (
                    <span className="type-check">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}

          </div>
        )}
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="filter-actions">

        <button
          type="button"
          className="clear-filters"
          onClick={handleClear}
        >
          Clear
        </button>

        <button
          type="button"
          className="apply-filters"
          onClick={handleApply}
        >
          Apply Filters
        </button>

      </div>

    </div>
  );
};

export default MovieFilters;