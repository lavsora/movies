import { Component } from 'react'
import { Pagination, Tabs, Input } from 'antd'
import { debounce } from 'lodash'

import { MoviesProvider } from '../Context/MoviesContext'
import MovieList from '../movie-list'
import ControlConnection from '../control-connection'
import moviesService from '../../service/movies-service'

import './app.css'

class App extends Component {
  // eslint-disable-next-line
  moviesRes = new moviesService()

  state = {
    searchValue: '',
    pageNumber: 1,
    totalPages: 1,
    activeTab: '1',
    status: null,
    allGenres: [],
  }

  debounced = debounce((value) => {
    this.setState({
      searchValue: value,
    })
  }, 1000)

  componentDidMount() {
    this.moviesRes.getGenre().then((genres) => {
      this.setState({
        allGenres: genres,
      })
    })
  }

  handleChangeInput = (e) => {
    this.debounced(e.target.value)
  }

  handleTotalPagesChange = (totalPages) => {
    this.setState({ totalPages })
  }

  updateStatus = (status) => {
    this.setState({
      status,
    })
  }

  updateTab = (activeTab) => {
    this.setState({ activeTab })
  }

  pagination(page) {
    this.setState({
      pageNumber: page,
    })
  }

  render() {
    const { searchValue, pageNumber, pageSizeNumber, totalPages, status, activeTab, allGenres } = this.state

    let viewPagination = (
      <Pagination
        current={pageNumber}
        total={totalPages}
        onChange={(page) => this.pagination(page)}
        showSizeChanger={false}
      />
    )

    if (status === 'emptyRatingMovies') {
      viewPagination = null
    }

    if (!searchValue.trim() || status !== null) {
      viewPagination = null
    }

    let searchInput = null

    if (activeTab === '1') {
      searchInput = (
        <Input size="large" placeholder="Type to search..." defaultValue="" onChange={this.handleChangeInput} />
      )
    }

    return (
      <ControlConnection>
        <div className="wrapper">
          <header>
            <div>
              <Tabs
                defaultActiveKey="1"
                size="large"
                onTabClick={this.updateTab}
                items={[
                  {
                    label: 'Search',
                    key: '1',
                  },
                  {
                    label: 'Rated',
                    key: '2',
                  },
                ]}
              />
              {searchInput}
            </div>
          </header>
          <main>
            <MoviesProvider value={allGenres}>
              <MovieList
                searchValue={searchValue}
                pageNumber={pageNumber}
                pageSizeNumber={pageSizeNumber}
                onTotalPagesChange={this.handleTotalPagesChange}
                updateStatus={this.updateStatus}
                activeTab={activeTab}
              />
            </MoviesProvider>
          </main>
          <footer>{viewPagination}</footer>
        </div>
      </ControlConnection>
    )
  }
}

export default App
