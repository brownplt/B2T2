class Schema
  attr_accessor :headers

  # Schema: an ordered sequence of column names and corresponding sorts.
  #
  # Thus, we represent a single instance of a schema item (correct term?) as so:
  # {
  #   column_name: COLUMN_NAME (distinct, string-like first-class datatype),
  #   sort: DATA_KIND (kind here is a Ruby class name)
  # }
  def initialize(headers: [])
    @headers = headers
  end

  def add_header(c)
    @headers += [c]
  end

  def column_names
    @headers.map do |h| 
      h[:column_name]
    end
  end

  def col(column_name)
    @headers.select{ |h| h[:column_name] == column_name}[0]
  end

  def duplicate
    Schema.new(headers: @headers.dup)
  end

  def ==(other)
    return @headers == [] if other == []
    return false if @headers.size != other.headers.size
    
    @headers.each_with_index do |header, i|
      return false if other.headers[i] != header
    end

    true
  end
end