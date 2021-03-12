import Loader from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loading" style={{ textAlign: "center"}}>
      	<Loader className="loading__loader flex justify-center items-center" type="ThreeDots" color="#00BFFF" height={80} width={80} />
    </div>
  );
};

export default Loading;