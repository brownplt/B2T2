# Cell: a container for data (which may be empty)
class Cell
  attr_accessor :value

  def initialize(value)
    @value = value
  end
end
