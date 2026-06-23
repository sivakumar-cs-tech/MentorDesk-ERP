
const Loader = ({ text = "Loading..." }) => (
  <div className="loader-wrap">
    <div className="loader-spinner" />
    <p>{text}</p>
  </div>
);

export default Loader;
