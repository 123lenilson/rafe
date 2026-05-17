export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-bold text-center mb-6">Login - Rafe</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="email@exemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="******" />
          </div>
          <button type="button" className="w-full bg-black text-white p-2 rounded">Entrar</button>
        </form>
      </div>
    </div>
  );
}
