const { Systems } = require('../../Constants');

module.exports = options => {
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const doGetRequest = options.doGetRequest;
  const buildNote = options.buildNote;

  const customerNotesUrl = id =>
    `https://zebracustomersproduction.azurewebsites.net/api/Customer/${id}/Notes`;
  const caseUrl = `https://zebrahomelessnessproduction.azurewebsites.net/api/casecheck/`;
  const caseNotesUrl = id =>
    `https://zebrahomelessnessproduction.azurewebsites.net/api/Cases/${id}/Notes`;
  const collabCaseworkUrl = `${process.env.COLLAB_CASEWORK_API}/contacts`;
  const collabCaseworkMessagesUrl = id => `${collabCaseworkUrl}/${id}/messages`;

  const fetchCustomerNotes = async id => {
    return await doJigsawGetRequest(customerNotesUrl(id));
  };

  const fetchCaseNotes = async id => {
    const casesResult = await fetchCases(id);

    const requests = casesResult.cases.map(c => {
      return doJigsawGetRequest(caseNotesUrl(c.id));
    });

    return [].concat.apply([], await Promise.all(requests));
  };

  const fetchCases = async id => {
    return await doJigsawGetRequest(caseUrl + id);
  };

  const fetchCustomerSms = async (jigsawId, hackneyToken) => {
    const authHeader = {
      Authorization: `Bearer ${hackneyToken}`
    };

    const smsContacts = await doGetRequest(
      collabCaseworkUrl,
      { jigsawId },
      authHeader
    );

    if (smsContacts.length === 0) return [];

    let contact;
    smsContacts.forEach(cont => {
      if (cont.jigsawId === jigsawId) {
        contact = cont;
      }
    });

    if (!contact) return [];
    const messages = await doGetRequest(
      collabCaseworkMessagesUrl(contact.id),
      {},
      authHeader
    );

    return messages.map(m => {
      return {
        id: m.id,
        title: `${m.outgoing ? 'Outgoing' : 'Incoming'} SMS`,
        text: m.message,
        date: m.time,
        user: m.user_id // TODO: need to get username
      };
    });
  };

  const processSMS = sms => {
    return sms.map(m => {
      return buildNote({
        id: m.id,
        title: m.title,
        text: m.text,
        date: m.date,
        user: m.user,
        system: 'SMS'
      });
    });
  };

  const processNotes = (notes, noteType) => {
    return notes.map(note => {
      const date = note.interviewDate ? note.interviewDate : note.createdDate;
      return buildNote({
        id: note.id,
        title: noteType,
        text: note.content,
        date: date,
        user: note.officerName,
        system: Systems.JIGSAW
      });
    });
  };
  return {
    execute: async (id, token) => {
      try {
        if (id) {
          const custNotes = await fetchCustomerNotes(id);
          const caseNotes = await fetchCaseNotes(id);
          const sms = await fetchCustomerSms(id, token);

          return processNotes(custNotes, 'Customer Note').concat(
            processNotes(caseNotes, 'Case Note'),
            processSMS(sms)
          );
        }
        return [];
      } catch (err) {
        console.log(`Error fetching customer notes in Jigsaw: ${err}`);
        return [];
      }
    }
  };
};
