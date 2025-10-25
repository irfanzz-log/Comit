import Link from "next/link";

export default function Nav(props) {
  return (
    <>
      <header className="flex justify-center relative mx-2">
        <nav className="flex md:absolute fixed z-100 justify-between items-center shadow-lg p-2 m-2 md:w-5/5 w-5/6 bg-blue-500 rounded-xl">
          <div className="logo flex flex-row items-center">
            <img className="max-w-15" src="/logo/commitLogo.png" alt="" />
          </div>
          <ul className="md:flex flex-row hidden">
            <li className="px-2 text-white">
              <Link href={props.link1}>{props.textLink1}</Link>
            </li>
            <li className="px-2 text-white">
              <Link href={props.link2}>{props.textLink2}</Link>
            </li>
          </ul>
          <ul className="">
            <li className="bg-white py-2 px-5 rounded-xl text-blue-500">
              <Link href="#">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
