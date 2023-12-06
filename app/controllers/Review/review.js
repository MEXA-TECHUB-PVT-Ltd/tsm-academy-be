const { pool } = require("../../config/db.config");
exports.createReview = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { name, review, rating, image } = req.body;

        if (!name) {
            return res.status(400).json({ error: true, message: "Please Provide Email" });
        }

        // Insert Log into the database
        const userData = await pool.query("INSERT INTO review(name,review,rating,image) VALUES($1,$2,$3,$4) returning *",
            [name, review, rating, image]
        );


        res.status(200).json({
            error: false,
            data: userData.rows[0],
            message: "Review Added Successfully",
        });
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateReview = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            review_id,
            name,
            review,
            rating,
            image

        } = req.body;
        // const reviewer = false;
        if (review_id === null || review_id === "" || review_id === undefined) {
            res.json({ error: true, message: "Please Provide Review Id" });

        } else {

            let query = 'UPDATE review SET ';
            let index = 2;
            let values = [review_id];


            if (name) {
                query += `name = $${index} , `;
                values.push(name)
                index++
            }
            if (review) {
                query += `review = $${index} , `;
                values.push(review)
                index++
            }
            if (rating) {
                query += `rating = $${index} , `;
                values.push(rating)
                index++
            }
            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            query += 'WHERE review_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)



            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Updated Review Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }


}

exports.deleteReview = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            review_id,
        } = req.body;
        // const reviewer = false;
        if (review_id === null || review_id === "" || review_id === undefined) {

            res.json({ error: true, message: "Please Provide Review Id" });

        } else {


            const deleteUserQuery = await pool.query(
                "DELETE FROM review WHERE review_id = $1",
                [review_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Review Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Review" });
            }

        }

    }
    catch (err) {

        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllReview = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM review"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Review" });

        } else {
            res.json({ error: false, message: "All Review Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllReviews = async (req, res) => {
    const client = await pool.connect();
    try {

        const query = 'SELECT * FROM review ORDER BY created_at DESC'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "All Reviews Fetched",
                error: false,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "could not fetch",
                error: true,
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
        })
    }
    finally {
        client.release();
    }
}

exports.getReviewDetails = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            review_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM review WHERE review_id =$1 '
        const result = await pool.query(query, [review_id]);
        // get messages 
        const Data = result.rows[0]//Log
        res.json({
            message: "All Review Fetched",
            error: false,
            data: Data,
        });

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
            data: err.message
        })
    }
    finally {
        client.release();
    }
}


