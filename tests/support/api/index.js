require('dotenv').config()

const { expect } = require('@playwright/test');

class Api {

    constructor(request) {
        this.baseApi = process.env.BASE_API
        this.request = request
        this.token = undefined
    }

    async setToken() {
        const response = await this.request.post(this.baseApi + '/sessions', {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            }
        })

        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token
    }

    async getCompanyIdByName(companyName) {
        const response = await this.request.get(this.baseApi + '/companies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            params: {
                name: companyName
            }
        })
        expect(response.ok()).toBeTruthy()

        const body = JSON.parse(await response.text())

        return body.data[0].id
    }

    async postMovie(movie) {
        const companyId = await this.getCompanyIdByName(movie.company)

        const response = await this.request.post(this.baseApi + '/movies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                featured: movie.featured
            }
        })
        expect(response.ok()).toBeTruthy()
    }

    async postTvShow(tvshow) {
        const companyId = await this.getCompanyIdByName(tvshow.company)

        const response = await this.request.post(this.baseApi + '/tvshows', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: companyId,
                release_year: tvshow.release_year,
                featured: tvshow.featured,
                seasons: tvshow.season
            }
        })
        expect(response.ok()).toBeTruthy()
    }

    async postLead(name, email) {
        const response = await this.request.post(this.baseApi + '/leads', {
            data: {
                name: name,
                email: email
            }
        })
        return response
    }
}

module.exports = { Api }