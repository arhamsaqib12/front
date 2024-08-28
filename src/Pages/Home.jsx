import React from 'react';
import SearchBar from './thirdbar';
import Tweets from './tweets';
import Thirdbar from "./thirdbar"
export default function Home() {
  return (
    <div className="container-fluid g-0 m-0 p-0 b-0">
      <div className="row g-0 m-0 p-0 b-0">
        
        <div className="col-md-12 col-sm-10  m-0 p-0 b-0">
          <Tweets />
        </div>
        {/* <div className="col-md-4 d-none d-md-block m-0 p-0 b-0">
          <SearchBar />
        </div> */}
        
      </div>
    </div>
  );
}
