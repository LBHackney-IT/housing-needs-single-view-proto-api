const { Systems } = require('@lib/Constants');
const { formatRecordDate } = require('@lib/Utils');

module.exports = options => {
  const doGetRequest = options.doGetRequest;
  const doJigsawGetRequest = options.doJigsawGetRequest;
  const jigsawEnv = options.jigsawEnv;

  const caseUrl = `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/casecheck/`;
  const customerNotesUrl = id =>
    `https://zebracustomers${jigsawEnv}.azurewebsites.net/api/Customer/${id}/Notes`;
  const caseNotesUrl = id =>
    `https://zebrahomelessness${jigsawEnv}.azurewebsites.net/api/Cases/${id}/Notes`;
  const collabCaseworkUrl = `${process.env.COLLAB_CASEWORK_API}/contacts`;
  const collabCaseworkMessagesUrl = id => `${collabCaseworkUrl}/${id}/messages`;

  const fetchCases = async id => {
    return await doJigsawGetRequest(caseUrl + id);
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

  const processNotesResults = (results, noteType) => {
    noteType = noteType || 'Note';
    return results.map(note => {
      const date = note.interviewDate
        ? formatRecordDate(note.interviewDate)
        : formatRecordDate(note.createdDate);

      return {
        title: noteType,
        text: note.content,
        date: date,
        user: note.officerName,
        system: Systems.JIGSAW
      };
    });
  };

  return async (id, hackneyToken) => {
    try {
      const custNotes = await fetchCustomerNotes(id);
      const caseNotes = await fetchCaseNotes(id);
      const sms = await fetchCustomerSms(id, hackneyToken);

      const messages = sms.map(m => {
        return {
          title: `${m.outgoing ? 'Outgoing' : 'Incoming'} SMS`,
          text: m.message,
          date: formatRecordDate(m.time),
          user: m.username,
          system: 'SMS'
        };
      });

      return processNotesResults(custNotes, 'Customer Note').concat(
        processNotesResults(caseNotes, 'Case Note'),
        messages
      );
    } catch (err) {
      console.log(`Error fetching customer notes in Jigsaw: ${err}`);
    }
  };
};
