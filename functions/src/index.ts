import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp()

export const addAdminRole = functions.https.onCall((data, context) => {

  return admin.auth().getUserByEmail(data.email).then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Parabéns ${data.email} você se tornou um admin!`
    }
  }).catch((erro) => {
    return erro;
  })

})

