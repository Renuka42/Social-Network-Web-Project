import pymysql,datetime,os,base64
from flask import Flask, request, jsonify,json,Response,url_for,send_file,redirect,flash
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flaskext.mysql import MySQL
from authenticate import token_required 
from random import randrange
import jwt

UPLOAD_FOLDER = '/home/oza/img/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

SECRET_KEY = "hkBxrbZ9Td4QEwgRewV6gZSVH4q78vBia4GBYuqd09SsiMsIjH"
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'oza'
app.config['MYSQL_DATABASE_PASSWORD'] = '12345678'
app.config['MYSQL_DATABASE_DB'] = 'db_oza'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


# Select 
@app.route('/select/pose_all', methods=['POST'] ,endpoint = 'red1')
@token_required 
def pose_all():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            if( str(result["working"]) == "0" ):
                cur.execute( "SELECT max(posed.pose_id) as MaxId FROM posed" )
                rows = cur.fetchone()
                result["pose_id"] = rows["MaxId"]+1
                print(result["pose_id"])

            cur.execute(
                            "SELECT posed.*,user.name_id,user.name,user.img_profile_base64_temp"
                            " FROM posed,user"
                            " WHERE posed.user_pose_fk in ("
                                " SELECT user0.user_id_void"
                                " FROM user_add_friend user0,user_add_friend user1"
                                " WHERE user0.user_id_main = (%s)"
                                " and user1.user_id_void = (%s)"
                                " and user0.user_id_void = user1.user_id_main)"
                            " AND user.u_id = posed.user_pose_fk"
                            " and posed.user_group_fk IS NULL"
                            " and posed.pose_id < (%s)"
                            " and lv_pose = 0"
                            " UNION"

                            " SELECT posed.*,user.name_id,user.name,user.img_profile_base64_temp"
                            " FROM posed,user"
                            " WHERE posed.user_pose_fk = (%s)"
                            " AND user.u_id = posed.user_pose_fk"
                            " and posed.user_group_fk IS NULL"
                            " and posed.pose_id < (%s)"
                            " and lv_pose = 0"
                            " ORDER BY pose_id DESC"
                            " LIMIT 10"
                            ,(str(result["user_id"]),str(result["user_id"]),str(result["pose_id"]),str(result["user_id"]),str(result["pose_id"]))
                        )
            
            rows = cur.fetchall()
            resp = jsonify(rows)
            resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()

@app.route('/select/pose_all/<pose_id>', methods=['GET'] ,endpoint = 'red33')
@token_required 
def pose_all_id(pose_id):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                    "SELECT * FROM `posed` WHERE pose_id = (%s)"
                    " and lv_pose = 0"
                    ,(str(pose_id))
                )
    data = cur.fetchall()
    resp = jsonify(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp    

@app.route('/delete/pose_delete', methods=['POST'] ,endpoint = 'yell1')
# @token_required 
def pose_delete():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            cur.execute(
                            "DELETE FROM posed WHERE posed.pose_id = (%s)",
                            (str(result["pose_id"]))
                        )
            conn.commit()
            resp = jsonify("1")
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)

@app.route('/delete/com_delete', methods=['POST'] ,endpoint = 'yell2')
# @token_required 
def com_delete():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            cur.execute(
                            "DELETE FROM comment WHERE comment.c_id = (%s)",
                            (str(result["c_id"]))
                        )
            conn.commit()
            resp = jsonify("1")
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)




@app.route('/select/commentCount/<pose_id>', methods=['GET'] ,endpoint = 'red22')
@token_required 
def commentCount(pose_id):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                    "SELECT COUNT(c_id) as count FROM comment WHERE pose_id_fk = (%s)"
                    ,(str(pose_id))
                )
    data = cur.fetchall()
    resp = jsonify(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp    

@app.route('/select/comment_all/<pose_id>/<r>', methods=['GET'] ,endpoint = 'red2')
@token_required 
def comment_all(pose_id,r):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                    "SELECT comment.*,user.name,user.img_profile_base64_temp"
                    " FROM comment,user"
                    " WHERE comment.user_comment_fk = user.u_id"
                    " and comment.pose_id_fk = (%s)"
                    " and c_id <= ("
                    "	SELECT max(c_id) FROM comment"
                    " )"
                    " ORDER BY c_id DESC"
                    " LIMIT %s,3 "
                    ,(str(pose_id),int(r))
                )
    data = cur.fetchall()
    resp = jsonify(data[::-1])
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp    

@app.route('/select/profile', methods=['POST'] ,endpoint = 'red3')
@token_required
def profile():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                        "SELECT * FROM user "
                        "WHERE user.u_id = (%s)"
                        ,(str(result["user_id"]))
                    )
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp   
         
@app.route('/select/friend/detail', methods=['POST'] ,endpoint = 'red32')
@token_required
def select_friend():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                        "SELECT * FROM user "
                        "WHERE user.u_id = (%s)"
                        ,(str(result["friend_id"]))
                    )
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp    

# Select 
@app.route('/select/group/pose_all', methods=['POST'] ,endpoint = 'red66')
@token_required 
def group_pose_all():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            if( str(result["working"]) == "0" ):
                cur.execute( "SELECT max(posed.pose_id) as MaxId FROM posed" )
                rows = cur.fetchone()
                result["pose_id"] = rows["MaxId"]
                print(result["pose_id"])

                cur.execute(
                            "SELECT posed.*,user.name_id,user.name,user.img_profile_base64_temp FROM posed,user "  
                            " WHERE user_group_fk = (%s)"
                            " and lv_pose = 1"
                            " and posed.pose_id <= (%s)"
                            " and user.u_id = posed.user_pose_fk"
                            " ORDER BY pose_id DESC"
                            " LIMIT 10"
                            ,(str(result["group_id"]),str(result["pose_id"]))
                        )
            
            rows = cur.fetchall()
            resp = jsonify(rows)
            resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()


@app.route('/select/like/<pose_id>', methods=['GET'] ,endpoint = 'red4')
@token_required 
def like_all(pose_id,*args, **kwargs):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                    "SELECT `pose_id_like`,`user_id_like`,user.name"
                    " FROM user_like_pose,user"
                    " WHERE user_id_like =user.u_id"
                    " and user_like_pose.pose_id_like = (%s)"
                    ,(str(pose_id))
                )
    data = cur.fetchall()
    resp = jsonify(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp  

@app.route('/select/friend', methods=['POST'] ,endpoint = 'red5')
@token_required 
def friend():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                  "SELECT u_id,username,name_id,img_profile_base64_temp,name,1 as infa FROM user"
                  "   WHERE user.u_id in ("
                  "  SELECT user0.user_id_void"
                  "  FROM user_add_friend user0,user_add_friend user1"
                  "  WHERE user0.user_id_main = (%s)"
                  "  and user1.user_id_void = (%s)"
                  "  and user0.user_id_void = user1.user_id_main)"
                  "  UNION "
                  "  SELECT u_id,username,name_id,img_profile_base64_temp,name,0 as infa FROM user"
                  "   WHERE user.u_id in ("
                  "  SELECT user_id_void"
                  "  FROM user_add_friend"
                  "  WHERE user_id_main = (%s))"
                  "  AND user.u_id NOT IN("
                  "  SELECT user0.user_id_void"
                  "  FROM user_add_friend user0,user_add_friend user1"
                  "  WHERE user0.user_id_main = (%s)"
                  "  and user1.user_id_void = (%s)"
                  "  and user0.user_id_void = user1.user_id_main)"
                  "  UNION "
                  "  SELECT u_id,username,name_id,img_profile_base64_temp,name,4 as infa FROM user"
                  "   WHERE user.u_id in ("
                  "  SELECT user_id_main"
                  "  FROM user_add_friend"
                  "  WHERE user_id_void = (%s))"
                  "  AND user.u_id NOT IN("
                  "  SELECT user0.user_id_void"
                  "  FROM user_add_friend user0,user_add_friend user1"
                  "  WHERE user0.user_id_main = (%s)"
                  "  and user1.user_id_void = (%s)"
                  "  and user0.user_id_void = user1.user_id_main)"

                    ,(str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]),
                    str(result["user_id"]))
        )
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp

@app.route('/select/group', methods=['POST'] ,endpoint = 'red6')
@token_required 
def group():

    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                    "SELECT user_add_group.group_id,group_user.name,group_user.user_create,group_user.img_profile "
                    " FROM user_add_group ,group_user"
                    " WHERE user_add_group.group_id = group_user.group_id"
                    " and user_add_group.user_id_main = (%s)",(str(result["user_id"])))
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp


@app.route('/select/search', methods=['POST'] ,endpoint = 'red7')
@token_required 
def search():
    result = request.get_json(force=True)
    print(result["text"],result["user_id"])
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                    " SELECT u_id,name_id,img_profile_base64_temp,name FROM user "
                    " WHERE name LIKE (%s)"
                    " OR name_id LIKE (%s)"
                    " LIMIT %s,%s ", ( '%'+str(result["text"])+'%', '%'+str(result["text"])+'%', int(result["start"]), int(result["end"])  )
                    )
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp


@app.route('/user/change', methods=['POST'] ,endpoint = 'red20')
##@token_required 
def user_change():

    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                        "UPDATE user"
                        " SET name = (%s), name_id= (%s) "
                        " WHERE u_id = (%s)",(
                            str(result["name"]),str(result["name_id"]),result["user_id"]
                        )
                    )
        conn.commit()
        resp = jsonify("1")
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp



#Select Profile
@app.route('/select/profile/yourself', methods=['POST'] ,endpoint = 'orange1')
@token_required 
def yourself():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            sqlStr = ""
            if(result["mode"] == "photo"):
                sqlStr="is NOT null"
            elif(result["mode"] == "text"):
                sqlStr="is null"
            cur.execute(
                            "SELECT * FROM posed WHERE user_pose_fk = (%s)"
                            "and user_upload_img "+sqlStr+
                            " and lv_pose = 0"
                            " ORDER BY pose_id DESC"
                            " LIMIT %s,9"
                            ,(
                                str(result["user_id"]),
                                int(result["working"])
                            )
                        )
            
            rows = cur.fetchall()
            resp = jsonify(rows)
            resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()

#Select Profile
@app.route('/select/profile/friend', methods=['POST'] ,endpoint = 'orange12')
@token_required 
def profile_friend():
    try:
        result = request.get_json(force=True)
        if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
            conn = mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            sqlStr = ""
            if(result["mode"] == "photo"):
                sqlStr="is NOT null"
            elif(result["mode"] == "text"):
                sqlStr="is null"
            cur.execute(
                            "SELECT * FROM posed"
                            " WHERE posed.user_pose_fk in (SELECT u_id FROM user"
                                " WHERE user.u_id in ("
                                                    " SELECT user0.user_id_void"
                                                    " FROM user_add_friend user0,user_add_friend user1"
                                                    " WHERE user0.user_id_main = (%s)"
                                                    " and user1.user_id_void = (%s)"
                                                    " and user0.user_id_void = user1.user_id_main))"
                            " AND posed.user_pose_fk = (%s)"
                            " and user_upload_img "+sqlStr+
                            " ORDER BY pose_id DESC"
                            " LIMIT %s,9"
                            ,(
                                str(result["user_id"]),
                                str(result["user_id"]),
                                str(result["friend_id"]),
                                int(result["working"])
                            )
                        )
            
            rows = cur.fetchall()
            resp = jsonify(rows)
            resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.content_type = "application/json"
            return resp
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()



# User 
@app.route('/user/register', methods=['POST'])
def register():
    try:
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        result = request.get_json(force=True)
        hashs = bcrypt.generate_password_hash(str(result["password"]), 10)
        cur.execute(
                        "INSERT INTO user (username,password,name_id,img_profile_base64_temp,name) VALUES (%s,%s,%s,%s,%s)",
                        (
                            str(result["username"]),
                            hashs,
                            str(result["name_id"]),
                            None,
                            str(result["name"])
                        )
                    )
        conn.commit()

        cur.execute(
                        "SELECT * FROM user WHERE username = (%s)"
                        ,(str(result["username"]))
                    )
        data = cur.fetchone()

        import os

        dirname = 'img/'+str(data["u_id"])+'/profile'
        dirname2 = 'img/'+str(data["u_id"])+'/group'

        try:
            os.makedirs(dirname)
            os.makedirs(dirname2)
        except OSError:
            if os.path.exists(dirname) or os.path.exists(dirname2):
                # We are nearly safe
                pass
            else:
                # There was an error on creation, so make sure we know about it
                raise
     
        return "1"
    except Exception as e:
        print("Problem inserting into db:" + str(e))
        return str(e)+"0"

@app.route('/user/login', methods=['POST'])
def login():
    try:
        conn = mysql.connect()
        result = request.get_json(force=True)
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                        "SELECT * FROM user WHERE username = (%s)"
                        ,(str(result["username"]))
                    )
        data = cur.fetchone()
        print(bcrypt.check_password_hash( str(data["password"]), str(result["password"]) ))
        print("databser "+str(data["password"]))
        print("user"+str(result["password"]))
        if bcrypt.check_password_hash( str(data["password"]), str(result["password"]) ):
            timeLimit = datetime.datetime.utcnow() + datetime.timedelta(minutes=1440) #set limit for user
            payload = {"user_id": str(data["u_id"]),"exp":timeLimit}
            token = jwt.encode(payload,SECRET_KEY)
            data = [
                    {
                        "error": "0",
                        "message": "Successful",
                        "token": token,
                        "Elapse_time": f"{timeLimit}"
                    }
                ]
            resp = jsonify(data)
            resp.headers.add('Access-Control-Allow-Origin', '*')
            resp.content_type = "application/json"
            return resp  
        else:
            return jsonify(False)
    except Exception as e:
        print(str(e))
        return str(e)+"0"





@app.route('/add/friend', methods=['POST'])
def add_friend():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        state = ""
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
            "SELECT user_id_main, user_id_void FROM user_add_friend WHERE user_id_main = %s and user_id_void = %s",(
                int(result["user_id"]),
                int(result["user_add"])
            )
        )
        data = cur.fetchall()
        print(data)
        if len(data) == 0:
            cur.execute(
                "INSERT INTO user_add_friend (user_id_main, user_id_void) VALUES (%s, %s)",(
                    str(result["user_id"]),
                    str(result["user_add"])
                )
            )
            conn.commit()
            state = "add friend"
        else:
            
            cur.execute(
            "DELETE FROM user_add_friend WHERE user_add_friend.user_id_main = (%s) AND user_add_friend.user_id_void = (%s) "
                ,(str(result["user_id"]),str(result["user_add"]))
            )
            conn.commit()
            cur.execute(
            "DELETE FROM user_add_friend WHERE user_add_friend.user_id_main = (%s) AND user_add_friend.user_id_void = (%s); "
                ,(str(result["user_add"]),str(result["user_id"]))
            )
            conn.commit()
            state = "remove friend"

        resp = jsonify(state)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp



# Group
@app.route('/group/create', methods=['POST'])
def create():
    try:
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        result = request.get_json(force=True)
        cur.execute(
            "INSERT INTO group_user (group_id,name,user_create) VALUES (%s,%s,%s)",
            (
                None,
                str(result["name"]),
                str(result["user_id"])
            )
                    )
        conn.commit()
        print(conn)
        cur.execute(
            "SELECT `group_id` FROM `group_user` WHERE `user_create` =  (%s) and `name` = (%s)",
            (
                str(result["user_id"]),
                str(result["name"]),
            )
                    )
        group_id = cur.fetchone()
        cur.execute(
            "INSERT INTO user_add_group (user_id_main, group_id) VALUES (%s, %s)",
            (
                str(result["user_id"]),
                str(group_id["group_id"]),
            )
        )
        conn.commit()
        return "1"
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return str(e)+"0"
@app.route('/group/add', methods=['POST'])
def add():

    try:
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        result = request.get_json(force=True)
        
        cur.execute("SELECT * FROM group_user WHERE group_id ="+str(result["group_id"]))
        data = cur.fetchone()
        cur.execute("SELECT u_id FROM user WHERE name_id = (%s)",str(result["name_id"]) )
        add = cur.fetchone()
        if str(result["user_request"]) == str(data["user_create"]):
            cur.execute(
                "INSERT INTO user_add_group (user_id_main,group_id) VALUES (%s,%s)",
                (
                    add["u_id"],
                    str(result["group_id"])
                )
                        )
            conn.commit()
            return "1"
        else:
            return "Error"
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return str(e)+"0"




@app.route('/select/group/friend', methods=['POST'] ,endpoint = 'red88')
@token_required 
def group_friend():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["user_id"]) ):
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
                        "SELECT 	u_id,username,name_id,img_profile_base64_temp,name FROM user"
                        " WHERE u_id in (  "
                        "                                SELECT user_id_main FROM user_add_group"
                        "                                WHERE group_id = (%s)  "
                        "                    )"

                    ,(str(result["group_id"]))
        )
        data = cur.fetchall()
        resp = jsonify(data)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp

@app.route('/select/group/details/<group_id>', methods=['GET'] ,endpoint = 'red99')
@token_required 
def group_details(group_id):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                 "SELECT *,  (SELECT COUNT(user_id_main) FROM user_add_group WHERE group_id = (%s)) as user_all "
                " FROM group_user WHERE group_id = (%s)",
                    (
                        str(group_id),
                        str(group_id)
                    )
                )
    data = cur.fetchall()
    resp = jsonify(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp   

# Pose
@app.route('/pose/text', methods=['POST'],endpoint = 'green1')
# @token_required 
def pose():
    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["u_id"]) ):
        date = datetime.datetime.now()
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        user_upload_img = None
        if(result["user_upload_img"] != ""):
            user_upload_img = str(result["user_upload_img"])
        print(user_upload_img)

        user_upload_video = None
        if(result["user_upload_video"] != None):
            user_upload_video = str(result["user_upload_video"])

        group_id = None
        if(result["group_id"] != None):
            group_id = str(result["group_id"])    

        text_pose = ""
        if(result["text"] != None):
            text_pose = str(result["text"])       

        cur.execute(
            "INSERT INTO posed" +
            "(pose_id, Datatime, Text, user_pose_fk, user_upload_img, user_upload_video, lv_pose, user_group_fk)"+
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (
                None,
                date,
                text_pose,
                str(result["u_id"]),
                user_upload_img,
                user_upload_video,
                str(result["lv_pose"]),
                group_id
            )
        )
        conn.commit()
        return "1"

@app.route('/pose/comment', methods=['POST'] ,endpoint = 'green2')
@token_required 
def comment():

    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["u_id"]) ):
        date = datetime.datetime.now()
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
            "INSERT INTO comment "+
            "(c_id, Datatime, Text, user_comment_fk, pose_id_fk) VALUES (%s, %s, %s, %s, %s)"
            ,(None,date,str(result["Text"]),str(result["u_id"]),str(result["pose_id"]))
        )
        conn.commit()
        resp = jsonify("1")
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.content_type = "application/json"
        return resp

@app.route('/pose/like', methods=['POST'] ,endpoint = 'green3')
@token_required 
def like_pose(): 

    result = request.get_json(force=True)
    if checkIdwithToken(request.headers['TOKEN'], str(result["u_id"]) ):
        state = ""
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute(
            "SELECT * FROM user_like_pose "
            "WHERE pose_id_like = (%s)"
            "and user_id_like = (%s)",(
                str(result["pose_id"]),
                str(result["u_id"])
            )
        )
        data = cur.fetchall()
        if len(data) == 0:
            cur.execute(
                "INSERT INTO user_like_pose" +
                "(pose_id_like, user_id_like)"+
                "VALUES (%s, %s)",(str(result["pose_id"]),str(result["u_id"]))
            )
            state = "liked"
        else:
            cur.execute(
                "DELETE FROM user_like_pose "
                "WHERE pose_id_like = (%s) AND user_id_like = (%s)"
                ,(str(result["pose_id"]),str(result["u_id"]))
            )
            state = "remove liked"
        conn.commit()
        resp = jsonify(state)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

@app.route('/photo/<userId>/<filename>', methods=['GET'])
def photo(userId,filename):
    return send_file("img/"+userId+"/"+filename+".jpg")

@app.route('/photo/<userId>/profile/<filename>', methods=['GET'])
def photoProfile(userId,filename):
    return send_file("img/"+userId+"/profile/"+filename+".jpg")

@app.route('/photo/<userId>/group/<filename>', methods=['GET'])
def groupProfile(userId,filename):
    return send_file("img/"+userId+"/group/"+filename+".jpg")


@app.route('/del/kuy/small', methods=['GET'])
def kuy():
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    cur.execute(
                    "SELECT * FROM user"
                )
    data = cur.fetchall()
    resp = jsonify(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp    


@app.route('/del/kuy/small/file', methods=['POST'],endpoint = 'green10')
def upload_file():
    userid = request.form['userid']
    if request.form['folder'] != None:
        folder = request.form['folder']       
    if request.method == 'POST':
        if 'file' not in request.files:
            print("1")
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            print("2")
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            number = ""
            for i in range(50):
                number += str(randrange(10))
            filename = (secure_filename(file.filename)).split(".")
            if len(filename) == 2:
                filename = filename[1]
            else:
                filename = filename[0]
                
            if folder == 'profile':
                file.save(os.path.join(app.config['UPLOAD_FOLDER']+userid+"/profile", number+".jpg"))
                conn = mysql.connect()
                cur = conn.cursor(pymysql.cursors.DictCursor)
                cur.execute("UPDATE user SET img_profile_base64_temp = %s where u_id = %s",(number,userid))
                conn.commit()
            elif folder == 'group':
                group_id = request.form['group']
                file.save(os.path.join(app.config['UPLOAD_FOLDER']+userid+"/group", number+".jpg"))
                conn = mysql.connect()
                cur = conn.cursor(pymysql.cursors.DictCursor)
                cur.execute("UPDATE group_user SET img_profile = %s WHERE group_id = %s;",(number,group_id))
                conn.commit()
            else:
                file.save(os.path.join(app.config['UPLOAD_FOLDER']+userid, number+".jpg"))

            resp = jsonify(number)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.content_type = "application/json"
            return resp
                        
    resp = jsonify("Error")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.content_type = "application/json"
    return resp   

def checkIdwithToken(tokens, userid):
    listTokens = tokens.split(".")
    jsonPasstoString = json.loads(base64.b64decode(listTokens[1]+"="))
    if(jsonPasstoString["user_id"] == userid):
        return True
    else: 
        return False

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == "__main__":
    app.run(debug=True,port=1238,host='0.0.0.0')
    # app.run(debug=True)


