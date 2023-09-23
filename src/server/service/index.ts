import * as auth from 'server/auth'
import { IRepository, IStorage } from 'server/service/interface'
import { Post } from '@prisma/client'
import { IService } from 'server/control/interface'

export class Service implements IService {
  repo: IRepository
  sto: IStorage
  constructor(repo: IRepository, sto: IStorage) {
    this.repo = repo
    this.sto = sto
  }
  onConnect = async () => {
    return 'connected'
  }
  onLoadUser = async (id: number) => {
    return this.repo.userRepo.getUser(id)
  }
  onLogin = async (email: string, password: string) => {
    let user = await this.repo.userRepo.getUserByEmail(email)
    if (user === null || !user) {
      return {
        valid: false,
        errMessage: 'user not exist',
        id: 0,
        name: '',
        accessToken: '',
        refreshToken: ''
      }
    }
    let validPassword = await this.repo.userRepo.isValidPassword(
      email,
      password
    )
    if (!validPassword) {
      return {
        valid: false,
        errMessage: 'Invalid password',
        id: 0,
        name: '',
        accessToken: '',
        refreshToken: ''
      }
    }
    let accessToken = auth.generateAccessToken(user.name)
    let refreshToken = auth.generateRefreshToken(user.name)
    return {
      valid: true,
      errMessage: '',
      id: user.id,
      name: user.name,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }
  onLoadPresignedUrl = async (filename: string) => {
    return await this.sto.getPresignedUrl(filename)
  }
  onLoadPresignedUrlPutObject = async (filename: string) => {
    return await this.sto.getPresignedUrlPutObject(filename)
  }
  onLoadPostListPageSortByDate = async (
    pageSize: number,
    pageIdx: number,
    published: boolean
  ) => {
    return await this.repo.postRepo.getPostListPageSortByDate(
      pageSize,
      pageIdx,
      published
    )
  }
  onLoadPostListPageSortByDateByCategory = async (
    pageSize: number,
    pageIdx: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => {
    if (categoryName === '') {
      return await this.repo.postRepo.getPostListPageSortByDateCategory(
        pageSize,
        pageIdx,
        categoryName,
        published,
        searchKeyword
      )
    }
    return await this.repo.postRepo.getPostListPageSortByDateCategory(
      pageSize,
      pageIdx,
      categoryName,
      published,
      searchKeyword
    )
  }
  onCreatePost = async (
    accessToken: string,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string
  ) => {
    const name = await this.repo.userRepo.checkAccessToken(
      accessToken as string
    )
    if (name === 'bdg') {
      let post = (await this.repo.postRepo.createPost(
        title,
        content,
        categoryName,
        thumbnail
      )) as Post
      return post
    }
    return {} as Post
  }
  onUpdatePost = async (
    accessToken: string,
    id: number,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string,
    published: boolean
  ) => {
    const name = await this.repo.userRepo.checkAccessToken(
      accessToken as string
    )
    if (name === 'bdg') {
      let post = (await this.repo.postRepo.updatePost(
        id,
        title,
        content,
        categoryName,
        thumbnail,
        published
      )) as Post
      return post
    }
    return {} as Post
  }
  onDeletePost = async (accessToken: string, id: number) => {
    const name = await this.repo.userRepo.checkAccessToken(
      accessToken as string
    )
    if (name === 'bdg') {
      let post = (await this.repo.postRepo.deletePost(id)) as Post
      return post
    }
    return {} as Post
  }
  onLoadCategoryList = async () => {
    const categoryList = this.repo.postRepo.getCategoryList()
    return categoryList
  }
  onCreateCategory = async (category: string) => {
    this.repo.postRepo.createCategory(category)
    return category
  }
  onLoadMaxPageIndexByCategory = async (
    pageSize: number,
    category: string,
    published: boolean,
    searchKeyword: string
  ) => {
    return await this.repo.postRepo.getMaxPageIndexByCategory(
      pageSize,
      category,
      published,
      searchKeyword
    )
  }
}
