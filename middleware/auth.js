export default function ({ store, redirect }) {
  if (!store.isAuth) {
    return redirect('/login')
  }
}
