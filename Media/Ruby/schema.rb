class Schema
  attr_accessor :headers

  # Schema: an ordered sequence of column names and corresponding sorts.
  #
  # Thus, we represent a single instance of a schema item (correct term?) as so:
  # {
  #   column_name: COLUMN_NAME (distinct, string-like first-class datatype),
  #   sort: DATA_KIND (kind here is a Ruby class name),
  #   order: ORDER_INDEX (distinct, unsigned integer)
  # }
  def initialize(headers: [])
    @headers = headers
  end

  def add_header(c)
    @headers += [c]
  end

  def duplicate
    Schema.new(headers: @headers.dup)
  end
end