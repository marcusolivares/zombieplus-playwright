export interface Movie {
  title: string
  overview: string
  company: string
  release_year: number
  featured: boolean
  cover?: string
}

export interface TvShow extends Movie {
  season: number
}

export interface Lead {
  name: string
  email: string
}
