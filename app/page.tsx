export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Krabby&apos;s Vault</h1>
      <p className="text-slate-400">Vault Keeper&apos;s workspace - Fish tax system with Iron Shell</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Git Repository</h2>
          <p className="text-green-400">Active</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Cloud Backup</h2>
          <p className="text-green-400">Synced</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <h2 className="text-xl font-semibold mb-2">Fish Tax</h2>
          <p className="text-amber-400">7 tributes</p>
        </div>
      </div>
    </main>
  );
}
