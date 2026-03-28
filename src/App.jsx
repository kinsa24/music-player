import Player from "./components/temp";

function App() {
  return (
    <div style={styles.container}>
      <Player />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
};

export default App;