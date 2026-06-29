import "./loading.css";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="loading-container">
      <h2>{text}</h2>
    </div>
  );
};

export default Loading;