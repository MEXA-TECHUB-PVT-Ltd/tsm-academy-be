const { pool } = require("../../config/db.config");

exports.createPackage = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {
            image,
            title,
            package_name,
            program_id,
            package_price,
            type,
            stripe_payment_link,
            feature,
            description,
            package_offer_price,
            total_students

        } = req.body;
        // const company_user = false;
        if (program_id === null || program_id === "" || program_id === undefined) {
            res.json({ error: true, message: "Please Provide Program Id " });

        } else {


            const userData = await pool.query("INSERT INTO packages(image,title,package_name,program_id,package_price,type,description,feature,stripe_payment_link,package_offer_price,total_students) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *",
                [
                    image,
                    title,
                    package_name,
                    program_id,
                    package_price,
                    type,
                    description,
                    feature,
                    stripe_payment_link,
                    package_offer_price,
                    total_students
                ])
            if (userData.rows.length === 0) {
                res.json({ error: true, data: [], message: "Can't Create Course" });


            } else {

                const data = userData.rows[0]
                res.json({
                    error: false, data: {
                        prices: data,
                    }, message: "Course Created Successfully"
                });

            }
        }
    }
    catch (err) {
        res.json({ error: true, data: err, message: "Catch eror" });

    } finally {
        client.release();
    }

}
exports.updatePackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            image,
            package_id,
            package_name,
            package_price,
            stripe_payment_link,
            feature,
            description,
            package_offer_price,
            total_students

        } = req.body;
        // const company_user = false;
        if (package_id === null || package_id === "" || package_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id " });

        } else {
            let query = 'UPDATE packages SET ';
            let index = 2;
            let values = [package_id];

            if (package_name) {
                query += `package_name = $${index} , `;
                values.push(package_name)
                index++
            }
            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            if (package_price) {
                query += `package_price = $${index} , `;
                values.push(package_price)
                index++
            }
            if (stripe_payment_link) {
                query += `stripe_payment_link = $${index} , `;
                values.push(stripe_payment_link)
                index++
            }
            if (feature) {
                query += `feature = $${index} , `;
                values.push(feature)
                index++
            }
            if (description) {
                query += `description = $${index} , `;
                values.push(description)
                index++
            }
            if (package_offer_price) {
                query += `package_offer_price = $${index} , `;
                values.push(package_offer_price)
                index++
            }
            if (total_students) {
                query += `total_students = $${index} , `;
                values.push(total_students)
                index++
            }

            query += 'WHERE package_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)

            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something Went Wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Price Updated Successfully" });

            }


        }




    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deletePackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const { package_id } = req.body
        const deleteUserQuery = await pool.query(
            "DELETE FROM packages WHERE package_id=$1", [
            package_id
        ]
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Package" });

        } else {
            res.json({ error: false, message: "Package Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllPackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const deleteUserQuery = await pool.query(
            "DELETE FROM Packages"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Package" });

        } else {
            res.json({ error: false, message: "All Package Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.getAllCustomers = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM users WHERE user_id <> $1 '
        const result = await pool.query(query, [user_id]);
        // get messages 
        // const Data= result.rows
        const Data = result.rows.filter(user => user.type !== 'admin');
        let Array = [];
        for (let i = 0; i < Data.length; i++) {
            const customerId = Data[i].user_id
            const queryText = `
            SELECT sender = $1 AS from_self, message AS message,type AS type,
            readStatus AS readStatus,
            created_at AS created_at
            FROM messages
            WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
            ORDER BY created_at ASC 
          `;

            let resultMessages = await client.query(queryText, [user_id, customerId]);
            // Filter the array to get objects with readstatus false and from_self false
            const filteredResults = resultMessages.rows.filter((row) => {
                return row.readstatus === "false" && row.from_self === false;
            });
            Array.push({
                user_id: Data[i].user_id,
                email: Data[i].email,
                password: Data[i].password,
                image: Data[i].image,
                user_name: Data[i].user_name,
                uniq_id: Data[i].uniq_id,
                unreadMessages: filteredResults.length
            })
        }


        if (result.rows) {
            res.json({
                message: "All Users Fetched",
                status: true,
                result: Array
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false,
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}

exports.getPackageByProductId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            package_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM packages WHERE package_id =$1 '
        const result = await pool.query(query, [package_id]);

        const query1 = 'SELECT * FROM programs'
        const result1 = await pool.query(query1);

        const query2 = 'SELECT * FROM product_videos WHERE package_id =$1 '
        const result2 = await pool.query(query2, [package_id]);
        // get messages 
        const Data = result1.rows[0]//product
        res.json({
            error: false, data: {
                course: result.rows[0],
                videos: result2.rows.length === 0 ? [] : result2.rows,
                program: Data,
            }, message: "Pricing Get Successfully"
        });
        //     }
        // });
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getPackageByPriceId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            price_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM packages WHERE package_id =$1 '
        const result = await pool.query(query, [price_id]);
        if (result.rows.length === 0) {
        } else {
            console.log(result.rows[0].program_id)
            const Prog_id = result.rows[0].program_id
            const query1 = 'SELECT * FROM programs WHERE program_id =$1 '
            const result1 = await pool.query(query1, [Prog_id]);

            const query2 = 'SELECT * FROM product_videos WHERE program_id =$1 '
            const result2 = await pool.query(query2, [Prog_id]);
            // get messages 
            const Data = result1.rows[0]//product
            res.json({
                error: false, data: {
                    prices: result.rows[0],
                    videos: result2.rows,
                    program: Data,
                }, message: "Pricing Get Successfully"
            });
        }







    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getAllPackages = async (req, res) => {
    const client = await pool.connect();
    try {

        //    const type="admin"
        const query = 'SELECT * FROM packages'
        const result = await pool.query(query);
        if (result.rows.length === 0) {
        } else {
            let ArrayData = []
            for (let i = 0; i < result.rows.length; i++) {
                const package_id = result.rows[i].package_id
                const query1 = 'SELECT * FROM product_videos WHERE package_id =$1 '
                const result1 = await pool.query(query1, [package_id]);

                // const query4 = 'SELECT * FROM req_programs WHERE package_id =$1 '
                // const result4 = await pool.query(query4, [package_id]);
                ArrayData.push({
                    package_id: result.rows[i].package_id,
                    package_name: result.rows[i].package_name,
                    image: result.rows[i].image,
                    title: result.rows[i].title,
                    program_id: result.rows[i].program_id,
                    package_price: result.rows[i].package_price,
                    type: result.rows[i].type,
                    stripe_payment_link: result.rows[i].stripe_payment_link,
                    feature: result.rows[i].feature,
                    description: result.rows[i].description,
                    enrolled_students: result.rows[i].total_students,
                    videos: result1.rows.length,
                    package_offer_price: result.rows[i].package_offer_price,
                })
            }

            res.json({
                error: false, result: ArrayData,
                message: "Courses Get Successfully"
            });
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getuserOtherCourses = async (req, res) => {
    const client = await pool.connect();
    try {
        const { user_id } = req.body
        // console.log(user_id)
        const queryUser = 'SELECT * FROM req_programs WHERE user_id = $1'
        const resultUser = await pool.query(queryUser,[user_id]);
        const excludedPackageIds = resultUser.rows.map(row => row.package_id);
        const params = [excludedPackageIds];
        const query = 'SELECT * FROM packages WHERE package_id NOT IN (SELECT unnest($1::integer[]))'
        const result = await pool.query(query,params);
        // console.log(result.rows)
        if (result.rows.length === 0) {
        } else {
            // let AllPrograms=result.rows
            let ArrayData = []

            for (let i = 0; i < result.rows.length; i++) {
                const package_id = result.rows[i].package_id
                const query1 = 'SELECT * FROM product_videos WHERE package_id =$1 '
                const result1 = await pool.query(query1, [package_id]);

                // const query4 = 'SELECT * FROM req_programs WHERE package_id =$1 '
                // const result4 = await pool.query(query4, [package_id]);
                ArrayData.push({
                    package_id: result.rows[i].package_id,
                    package_name: result.rows[i].package_name,
                    image: result.rows[i].image,
                    title: result.rows[i].title,
                    program_id: result.rows[i].program_id,
                    package_price: result.rows[i].package_price,
                    type: result.rows[i].type,
                    stripe_payment_link: result.rows[i].stripe_payment_link,
                    feature: result.rows[i].feature,
                    description: result.rows[i].description,
                    enrolled_students: result.rows[i].total_students,
                    videos: result1.rows.length,
                    package_offer_price: result.rows[i].package_offer_price,
                })
            }

            res.json({
                error: false, result: ArrayData,
                message: "Courses Get Successfully"
            });
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getUserEnrolledCourses = async (req, res) => {
    const client = await pool.connect();
    try {
        const { user_id } = req.body
        //    const type="admin"
        const query = 'SELECT * FROM req_programs WHERE user_id=$1'
        const result = await pool.query(query, [user_id]);
        if (result.rows.length === 0) {
        } else {
            let UserEnrolledCourses = [];
            for (let i = 0; i < result.rows.length; i++) {
                const program_id = result.rows[i].program_id;
                const package_id = result.rows[i].package_id;


                const query2 = 'SELECT * FROM programs WHERE program_id =$1';
                const result2 = await pool.query(query2, [program_id]);

                const query3 = 'SELECT * FROM packages WHERE package_id =$1';
                const result3 = await pool.query(query3, [package_id]);

                const query4 = 'SELECT * FROM product_videos WHERE package_id =$1';
                const result4 = await pool.query(query4, [package_id]);
                console.log(result2.rows);
                UserEnrolledCourses.push({
                    program: result2.rows[0],
                    package: result3.rows[0],
                    videos: result4.rows, // Use i instead of 0 to get the description of the current row
                });
            }
            res.json({
                error: false, result: UserEnrolledCourses,
                message: "Courses Get Successfully"
            });
        }







    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}

exports.getAllVideos = async (req, res) => {
    const client = await pool.connect();
    try {

        //    const type="admin"
        const query = 'SELECT * FROM product_videos'
        const result = await pool.query(query);
        if (result.rows.length === 0) {
        } else {

            res.json({
                error: false, result: result.rows,
                message: "Videos Get Successfully"
            });
        }







    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getByVideoId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_videos_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM product_videos WHERE product_videos_id =$1 '
        const result = await pool.query(query, [product_videos_id]);
        const package_id = result.rows[0].package_id
        const program_id = result.rows[0].program_id

        const query1 = 'SELECT * FROM programs WHERE program_id =$1 '
        const result1 = await pool.query(query1, [program_id]);

        const query2 = 'SELECT * FROM packages WHERE package_id =$1 '
        const result2 = await pool.query(query2, [package_id]);
        // get messages 
        const Data = result1.rows[0]//product
        res.json({
            error: false, data: {
                videos: result.rows[0],
                course: result2.rows[0],
                program: Data,
            }, message: "Pricing Get Successfully"
        });
        //     }
        // });
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}




