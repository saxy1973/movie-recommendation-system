import { useState } from "react";
import "./Assistant.css";

const Assistant = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stores the latest recommendation list
  const [recommendations, setRecommendations] = useState([]);

  // ==========================================
  // EXTRACT MOVIES FROM AI RESPONSE
  // ==========================================

  const extractMovies = (reply) => {
    if (!reply) return [];

    const movies = [];

    const lines = reply.split("\n");

    lines.forEach((line) => {
      /*
        Supported examples:

        1. Dil To Pagal Hai (1997) — TOP PICK — reason

        2. Kuch Kuch Hota Hai (1998) — reason

        3. **Veer-Zaara (2004)** — reason

        4) Jab We Met (2007) - reason
      */

      const match = line.match(
        /^\s*(\d+)[.)]\s*(?:\*\*)?(.+?)(?:\s*\((\d{4})\))?(?:\*\*)?(?:\s*[—-].*)?$/
      );

      if (!match) {
        return;
      }

      const number = Number(match[1]);

      let title = match[2] || "";

      const year = match[3] || "";

      // Remove markdown **
      title = title
        .replace(/\*\*/g, "")
        .trim();

      // Remove TOP PICK
      title = title
        .replace(/\s*TOP PICK\s*/gi, "")
        .trim();

      // Remove accidental trailing dash
      title = title
        .replace(/\s*[—-]\s*$/, "")
        .trim();

      if (!title) {
        return;
      }

      movies.push({
        number,
        title,
        year,
      });
    });

    // Sort by number
    movies.sort((a, b) => a.number - b.number);

    console.log(
      "===================================="
    );
    console.log("EXTRACTED MOVIES:");
    console.log(movies);
    console.log(
      "===================================="
    );

    return movies;
  };

  // ==========================================
  // SEND NORMAL MESSAGE
  // ==========================================

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    await sendMessageDirect(text);
  };

  // ==========================================
  // SUGGESTION BUTTON
  // ==========================================

  const handleSuggestion = (text) => {
    if (loading) {
      return;
    }

    console.log(
      "SUGGESTION CLICKED:",
      text
    );

    sendMessageDirect(text);
  };

  // ==========================================
  // MAIN SEND FUNCTION
  // ==========================================

  const sendMessageDirect = async (
    originalText
  ) => {
    let text = originalText.trim();

    if (!text || loading) {
      return;
    }

    console.log(
      "===================================="
    );
    console.log(
      "ORIGINAL USER MESSAGE:",
      text
    );

    // ========================================
    // NUMBER SELECTION
    // ========================================

    const numberMatch =
      text.match(/^(\d+)$/);

    if (numberMatch) {
      const selectedNumber =
        Number(numberMatch[1]);

      console.log(
        "USER SELECTED NUMBER:",
        selectedNumber
      );

      const selectedMovie =
        recommendations.find(
          (movie) =>
            movie.number === selectedNumber
        );

      if (selectedMovie) {
        console.log(
          "SELECTED MOVIE:",
          selectedMovie
        );

        text = `Tell me about the movie "${selectedMovie.title}"${
          selectedMovie.year
            ? ` (${selectedMovie.year})`
            : ""
        }`;

        console.log(
          "CONVERTED MESSAGE:",
          text
        );
      } else {
        console.log(
          "NO MOVIE FOUND FOR NUMBER:",
          selectedNumber
        );

        /*
          Important:

          If no recommendation is stored,
          don't send a random movie.

          Send the number normally so backend
          can use conversation context.
        */
      }
    }

    // ========================================
    // CREATE HISTORY
    // ========================================

    const history = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    console.log(
      "HISTORY SENT TO BACKEND:",
      history
    );

    // ========================================
    // UPDATE UI
    // ========================================

    setMessages(history);
    setMessage("");
    setLoading(true);

    // ========================================
    // API CALL
    // ========================================

    try {
      console.log(
        "CALLING BACKEND..."
      );

      const response = await fetch(
        "http://localhost:5000/api/assistant",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: text,
            history: history,
          }),
        }
      );

      console.log(
        "BACKEND STATUS:",
        response.status
      );

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "BACKEND RESPONSE:",
        data
      );

      // ========================================
      // RATE LIMIT ERROR
      // ========================================

      if (
        response.status === 429 ||
        data.rateLimited
      ) {
        throw new Error(
          data.message ||
            "AI daily limit has been reached. Please try again later."
        );
      }

      // ========================================
      // OTHER API ERROR
      // ========================================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "AI response failed."
        );
      }

      // ========================================
      // EXTRACT RECOMMENDATIONS
      // ========================================

      const extractedMovies =
        extractMovies(data.reply);

      if (
        extractedMovies.length > 0
      ) {
        console.log(
          "SAVING RECOMMENDATIONS:",
          extractedMovies
        );

        setRecommendations(
          extractedMovies
        );
      }

      // ========================================
      // ADD AI MESSAGE
      // ========================================

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      console.log(
        "AI MESSAGE ADDED SUCCESSFULLY"
      );
    } catch (error) {
      console.error(
        "===================================="
      );

      console.error(
        "ASSISTANT ERROR:",
        error
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "===================================="
      );

      // ========================================
      // SHOW ERROR TO USER
      // ========================================

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",
          content:
            error.message ||
            "Sorry, I couldn't respond right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <aside
      className={`assistant-panel ${
        isOpen ? "open" : "closing"
      }`}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="assistant-header">
        <h2>
          🤖 Movira Assistant
        </h2>

        <button
          type="button"
          className="assistant-close"
          onClick={onClose}
          aria-label="Close assistant"
        >
          ✕
        </button>
      </div>

      {/* =====================================
          BODY
      ====================================== */}

      <div className="assistant-body">

        {/* ===================================
            WELCOME
        ==================================== */}

        {messages.length === 0 && (
          <>
            <div className="assistant-welcome">
              <h3>
                Hey Bhumika! 👋
              </h3>

              <p>
                What are you looking
                for today?
              </p>
            </div>

            <div className="assistant-suggestions">

              {/* MOVIE SUGGESTION */}

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "Suggest a movie for me"
                  )
                }
              >
                ✨ Suggest a movie
              </button>

              {/* HINDI MOVIES */}

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "Suggest some good Hindi movies"
                  )
                }
              >
                🇮🇳 Hindi movies
              </button>

              {/* DDLJ */}

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "Suggest movies like DDLJ"
                  )
                }
              >
                🎬 Movies like DDLJ
              </button>
            </div>
          </>
        )}

        {/* ===================================
            CHAT MESSAGES
        ==================================== */}

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`assistant-message ${
                msg.role === "user"
                  ? "user-message"
                  : "ai-message"
              }`}
            >
              {msg.content}
            </div>
          )
        )}

        {/* ===================================
            LOADING
        ==================================== */}

        {loading && (
          <div className="assistant-message ai-message">
            🤖 Thinking...
          </div>
        )}
      </div>

      {/* =====================================
          INPUT
      ====================================== */}

      <div className="assistant-input-area">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              sendMessage();
            }
          }}
          disabled={loading}
        />

        <button
          type="button"
          className="assistant-send"
          onClick={sendMessage}
          disabled={loading}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </aside>
  );
};

export default Assistant;