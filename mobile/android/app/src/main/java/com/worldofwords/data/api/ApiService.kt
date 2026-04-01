package com.worldofwords.data.api

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class WordRequest(val word: String, val lang: String)
data class WordOnlyRequest(val word: String)
data class SentenceResponse(val sentence: String)

interface ApiService {
    @POST("/api/audio")
    suspend fun getAudio(@Body request: WordRequest): Response<ResponseBody>

    @POST("/api/sentence")
    suspend fun getSentence(@Body request: WordRequest): Response<SentenceResponse>

    @POST("/api/image")
    suspend fun getImage(@Body request: WordOnlyRequest): Response<ResponseBody>
}
