import './App.css';
import ArticleList from './components/ArticleList';

function App() {
  return (
    <div className="App">
      <ArticleList/>
      {/* <BrowserRouter>
        <Routes>
            <Route path="/" element ={} />
            <Route path="/AddMagazin" element ={<AddMagazin/>} />
            <Route path="/AddMagazin/:id" element ={<AddMagazin/>} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
