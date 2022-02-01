const success = ({ response, message, entity, data }) => {
  response.status(200).send({
    status: true,
    message,
    entity,
    data,
  });
};

const bad_request = ({ response, message, error }) => {
  response.status(400).send({
    status: false,
    message,
    error,
  });
};

const not_allowed = ({ response, message, error }) => {
  response.status(405).send({
    status: false,
    message,
    error,
  });
};

const not_found = ({ response, message, error }) => {
  response.status(404).send({
    status: false,
    message,
    error,
  });
};

export default { success, bad_request, not_allowed, not_found };
