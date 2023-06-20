import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import sklearn.metrics as metrics

# Read the data　Pathを変更してください
data = pd.read_csv("/********/cinemaTicket_Ref.csv")

# Let's drop the null values
data.dropna(inplace=True)

#Assigning X values based on correlation with y
X = data[['ticket_price', 'occu_perc', 'show_time', 'tickets_sold','ticket_use','capacity']]
Y = data['total_sales']

#Splitting the data into training and testing
X_train,X_test,Y_train,Y_test = train_test_split(X,Y,train_size=0.7,random_state=42)

lr = LinearRegression()
lr.fit(X_train,Y_train)

#PREDICTING THE DATA
y_pred = lr.predict(X_test)

#Checking r2_score
r_squared = r2_score(Y_test, y_pred)
r_squared

print('MAE: {}'.format(metrics.mean_absolute_error(Y_test, y_pred)))
print('MSE: {}'.format(metrics.mean_squared_error(Y_test, y_pred)))
print('RMSE: {}'.format(np.sqrt(metrics.mean_squared_error(Y_test, y_pred))))

def json_to_df(file_path):
    # json file を開いてデータをロード
    with open(file_path, 'r') as f:
        data_dict = json.load(f)
    
    # json dataをpandas dataframeに変換
    data_df = pd.DataFrame(data_dict, index=[0])
    return data_df

# JSONファイルのパスを指定　Pathを変更してください
json_file_path = "//********//input.json"

# JSONデータをデータフレームに変換
input_data = json_to_df(json_file_path)

# 'ticket_price', 'occu_perc', 'show_time', 'tickets_sold', 'ticket_use', 'capacity' の順番に整列
input_data = input_data[['ticket_price', 'occu_perc', 'show_time', 'tickets_sold','ticket_use','capacity']]

# total_sales の予測
total_sales_pred = lr.predict(input_data)
total_sales_pred

# Python dictionaryとして結果を作成
result_dict = {"total_sales_pred": total_sales_pred.tolist()}

# JSON fileへの出力
with open("output.json", "w") as json_file:
    json.dump(result_dict, json_file)