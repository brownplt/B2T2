class Schema
  attr_accessor :headers

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