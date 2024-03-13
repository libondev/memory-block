// import { Link, NavLink } from 'react-router-dom'

export default function About() {
  return (
    <>
      <div>about page</div>
      <Link to="/" className="text-14px">IndexPage</Link>
      <NavLink
        to="/about"
        className={
          navData => (navData.isActive ? 'text-#f00 ml-2' : 'text-14px ml-2')
        }
      >
        Home
      </NavLink>
    </>
  )
}
