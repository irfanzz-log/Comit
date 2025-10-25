export default function Loading() {
  return (
    <>
      <div className="loading flex justify-center items-center z-1000 fixed w-screen h-screen bg-white top-0">
        <img className="w-25 z-1000" src="./logo/commitLogo.png" alt="" />
        <div className="w-full loading-bg">
          <div className="loading-circle"></div>
        </div>
      </div>
    </>
  );
}
