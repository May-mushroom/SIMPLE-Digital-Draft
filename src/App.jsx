import NavBar from "./app-shell/NavBar.jsx";
import FileList from "./app-shell/FileList.jsx";
import SettingBar from "./app-shell/SettingBar.jsx";
import Tiptap from "./app-shell/Tiptap.jsx";
function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavBar />
      <Tiptap />
    </div>
  );
}

export default App;
