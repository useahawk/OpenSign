import Parse from "parse";
export default async function findContact(value) {
  try {
    const currentUser = Parse.User.current();
    const contactbook = new Parse.Query("contracts_Contactbook");
    contactbook.equalTo(
      "CreatedBy",
      Parse.User.createWithoutData(currentUser.id)
    );
    contactbook.notEqualTo("IsDeleted", true);
    contactbook.matches("Email", new RegExp(value, "i"));

    const contactRes = await contactbook.find();
    if (contactRes) {
      const res = JSON.parse(JSON.stringify(contactRes));
      return res;
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}
