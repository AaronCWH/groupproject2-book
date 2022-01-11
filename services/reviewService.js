const { Reviews } = require("../connect.js");

module.exports = {
    addReview: async (userid, indexid, rev) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        const newReview = await Reviews.create({
            review: rev,
            userId: userid,
            indexId: indexid
        })


        // if (rev !== review.review) {
        //     review.review = rev;
        // }

        await newReview.save();
        result.data = newReview;
        result.status = 200;
        result.message = `review added`;;

        return result;
    },
};

/*
[
  [
    {
      "reviewId": 1,
      "review": "Lots of suspense and mystery, a fascinating read.",
      "userId": 1,
      "indexId": 2,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "reviewId": 2,
      "review": "I am looking forward to the sequel!",
      "userId": 2,
      "indexId": 1,
      "createdAt": null,
      "updatedAt": null
    }
  ]
]

{
"rev":"NO SEQUELS NEEDEDED!",
"userId":2,
"indexId":1
}

*/


