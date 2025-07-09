export default (req, res, next) => {
  res.status(404).json({ error: "The requested URL is not valid" });
};
