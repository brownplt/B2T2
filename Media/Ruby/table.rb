class Table
  attr_accessor :rows, :schema

  def initialize(schema: [], rows: [])
    @rows = rows
    @schema = schema
  end
end