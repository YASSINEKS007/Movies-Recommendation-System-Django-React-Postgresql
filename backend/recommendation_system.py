import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import KNeighborsRegressor
from scipy.spatial.distance import pdist, squareform
from scipy.sparse.linalg import svds
import numpy as np

def load_data(path):
    dataset = pd.read_csv(path)
    return dataset

def merge_data(items, ratings, commun_feature):
    return pd.merge(items, ratings, on=commun_feature)

def create_ratings_matrix(merged_data, index, columns, values):
    return merged_data.pivot_table(index=index, columns=columns, values=values)

def fill_ratings_matrix(ratings_matrix):
    avg_ratings = ratings_matrix.mean(axis=1)
    ratings_matrix_centered = ratings_matrix.sub(avg_ratings, axis=0)
    ratings_matrix_centered_normed = ratings_matrix_centered.fillna(0)
    return ratings_matrix_centered_normed

def cosine_similarity_dataframe(ratings_matrix_filled):
    similarities = cosine_similarity(ratings_matrix_filled)
    return pd.DataFrame(similarities, index=ratings_matrix_filled.index, columns=ratings_matrix_filled.index)

def get_nearest_neighbors(user_id, cosine_similarity_df, ratings_matrix):
    user_similarity_series = cosine_similarity_df.loc[user_id]
    ordered_similarities = user_similarity_series.sort_values(ascending=False)
    nearest_neighbors = ordered_similarities[1:11].index
    return nearest_neighbors

def get_neighbor_ratings(nearest_neighbors, ratings_matrix):
    neighbor_ratings = ratings_matrix.reindex(nearest_neighbors)
    return neighbor_ratings

def calculate_mean_neighbor_rating(neighbor_ratings, item_id):
    return neighbor_ratings[item_id].mean()

def predict_user_rating(user_id, item_id, cosine_similarity_df, ratings_matrix):
    nearest_neighbors = get_nearest_neighbors(user_id, cosine_similarity_df, ratings_matrix)
    neighbor_ratings = get_neighbor_ratings(nearest_neighbors, ratings_matrix)
    return calculate_mean_neighbor_rating(neighbor_ratings, item_id)

def train_user_knn_model(ratings_matrix, user_id, item_id):
    ratings_matrix_filled_copy = fill_ratings_matrix(ratings_matrix).copy()  # Make a copy of the DataFrame
    ratings_matrix_filled_copy.drop(item_id, axis=1, inplace=True)
    target_user_x = ratings_matrix_filled_copy.loc[[user_id]]
    other_users_y = ratings_matrix[item_id]
    other_users_x = ratings_matrix_filled_copy[other_users_y.notnull()]
    other_users_y.dropna(inplace=True)
    user_knn = KNeighborsRegressor(metric='cosine', n_neighbors=min(30, len(other_users_x)))
    user_knn.fit(other_users_x, other_users_y)
    user_user_pred = user_knn.predict(target_user_x)
    return user_user_pred[0]

def svd_matrix_decomposition(ratings_matrix_filled):
    U, sigma, Vt = svds(ratings_matrix_filled.values)
    return U, sigma, Vt

def recreate_ratings_matrix(ratings_matrix, U, sigma, Vt):
    sigma = np.diag(sigma)
    U_sigma = np.dot(U, sigma)
    U_sigma_Vt = np.dot(U_sigma, Vt)
    avg_ratings = ratings_matrix.mean(axis=1)
    uncentered_ratings = U_sigma_Vt + avg_ratings.values.reshape(-1, 1)
    pred_ratings_df = pd.DataFrame(uncentered_ratings, 
                                   index=ratings_matrix.index,
                                   columns=ratings_matrix.columns)
    return pred_ratings_df

def create_genre_matrix(movies):
    movies['genres_list'] = movies['genres'].apply(lambda x: x.split('|'))
    unique_genres = set()
    for genres in movies['genres_list']:
        unique_genres.update(genres)
    matrix = pd.DataFrame(0, index=movies['movieId'], columns=list(unique_genres))  # Convert set to list
    for index, row in movies.iterrows():
        movie_id = row['movieId']
        for genre in row['genres_list']:
            matrix.loc[movie_id, genre] = 1
    return matrix

def jaccard_dataframe(genres_matrix):
    jaccard_distances = pdist(genres_matrix.values, metric='jaccard')
    jaccard_similarity_array = 1 - squareform(jaccard_distances)
    jaccard_similarity_df = pd.DataFrame(jaccard_similarity_array, index=genres_matrix.index, columns=genres_matrix.index)
    return jaccard_similarity_df

def get_top_recommendations(jaccard_similarity_df, movie_id, k):
    similarities = jaccard_similarity_df.loc[movie_id]
    top_similarities = similarities.sort_values(ascending=False).head(k+1)
    result = [get_title_by_id(i) for i in top_similarities[1:].index]
    return result

def retrieve_user_ratings(user_id, ratings_matrix):
    user_ratings = ratings_matrix.loc[user_id]
    ratings_dict = user_ratings.to_dict()
    return ratings_dict

def get_rating(user_id, item, ratings_matrix):
    return ratings_matrix.loc[user_id, item]

def get_title_by_id(movie_id):
    return movies.loc[movies['movieId'] == movie_id, 'title'].values[0]

def get_last_user_id(ratings_matrix):
    return ratings_matrix.index[-1]

def get_num_items_rated(ratings_matrix, user_id):
    user_ratings = ratings_matrix.loc[user_id]
    num_items_rated = user_ratings.notnull().sum()
    return num_items_rated

def get_top_k_ratings(user_id, mat_dataframe, k):
    user_ratings = mat_dataframe.loc[user_id]
    top_k_ratings = user_ratings.sort_values(ascending=False).head(k)
    top_k_movie_ids = top_k_ratings.index.tolist()
    return top_k_movie_ids
