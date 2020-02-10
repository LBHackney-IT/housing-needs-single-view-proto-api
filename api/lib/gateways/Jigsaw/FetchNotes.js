const { Systems } = require('../../Constants');

module.exports = options => {
  const getSystemId = options.getSystemId;
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const jigsawEnv = options.jigsawEnv;
  const doGetRequest = options.doGetRequest;
  const buildNote = options.buildNote;

  const customerNotesUrl = id =>
    `https://zebracustomers${jigsawEnv}.azurewebsites.net/api/Customer/${id}/Notes`;
  const caseUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/casecheck/`;
  const caseNotesUrl = id =>
    `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/Cases/${id}/Notes`;
  const collabCaseworkUrl = `${process.env.COLLAB_CASEWORK_API}/contacts`;
  const collabCaseworkMessagesUrl = id => `${collabCaseworkUrl}/${id}/messages`;

  const fetchSystemId = async id => {
    return await getSystemId.execute(Systems.JIGSAW, id);
  };

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
    const smsContact = await doGetRequest(
      collabCaseworkUrl,
      { jigsawId },
      {
        Authorization: `Bearer ${hackneyToken}`
      }
    );

    if (smsContact.length === 0) return [];

    return await doGetRequest(collabCaseworkMessagesUrl(smsContact[0].id));
  };

  const processSMS = sms => {
    return sms.map(m => {
      return buildNote({
        title: `${m.outgoing ? 'Outgoing' : 'Incoming'} SMS`,
        text: m.message,
        date: m.time,
        user: m.username,
        system: 'SMS'
      });
    });
  };

  const processNotes = (notes, noteType) => {
    return notes.map(note => {
      const date = note.interviewDate ? note.interviewDate : note.createdDate;
      return buildNote({
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
      const jigsaw_id = await fetchSystemId(id);
      const custNotes = await fetchCustomerNotes(jigsaw_id);
      const caseNotes = await fetchCaseNotes(id);
      const sms = await fetchCustomerSms(id, token);

      return processNotes(custNotes, 'Customer Note').concat(
        processNotes(caseNotes, 'Case Note'),
        processSMS(sms)
      );
      } catch (err) {
        console.log(`Error fetching customer notes in Jigsaw: ${err}`);
        return [];
      }
    }
  };
};
