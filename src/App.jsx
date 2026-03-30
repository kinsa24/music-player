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
    height: "140vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #17262d, #1b2a2f, #1f90c0)",
  },
};

export default App;