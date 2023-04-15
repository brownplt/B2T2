# frozen_string_literal: true

# Schema: an ordered sequence of column names and corresponding sorts.
#
# Thus, we represent a single instance of a schema item (correct term?) as so:
# {
#   column_name: COLUMN_NAME (distinct, string-like first-class datatype),
#   sort: DATA_KIND (kind here is a Ruby class name)
# }
class Schema
  attr_accessor :headers

  def initialize(headers: [])
    @headers = headers
  end

  # SPEC VIOLATION
  def ==(other)
    return @headers == [] if other == []
    return false if @headers.size != other.headers.size

    @headers.each_with_index do |header, i|
      return false if other.headers[i] != header
    end

    true
  end
end
