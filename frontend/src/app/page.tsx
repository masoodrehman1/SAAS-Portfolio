import Link from "next/link";
export default function Home(){
  return(
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="flex">
        <div className="flex">
          <div className="w-9 h-9 rounded-lg">M</div>
        </div>
      </nav>
      <div>
        <h1>My Portfolio</h1>
        <p>its a SAAS portfolio</p>
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}