class Table
  attr_accessor :rows, :schema

  def initialize(rows: [])
    @rows = rows
    @schema = []
  end
end